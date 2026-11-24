import { useCallback, useEffect, useRef, useState } from 'react';
import type { AreaPoint, OHLCCandle, ThemeId } from '../types';
import { formatCompactIDR, formatIDR } from '../core/format';
import { Icon } from './Icon';

function useChartSize(ref: React.RefObject<HTMLDivElement | null>){
 const [size,setSize]=useState({width:0,height:240});
 useEffect(()=>{const el=ref.current;if(!el)return;const ro=new ResizeObserver(([entry])=>setSize({width:Math.max(280,entry.contentRect.width),height:240}));ro.observe(el);return()=>ro.disconnect()},[ref]);
 return size;
}
function svgPath(points:{x:number;y:number}[]){return points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ')}

export function AreaChart({data,theme}:{data:AreaPoint[];theme:ThemeId}){
 const wrap=useRef<HTMLDivElement>(null),size=useChartSize(wrap),[hover,setHover]=useState<number|null>(null);
 const pad={l:10,r:12,t:20,b:32},w=Math.max(280,size.width),h=size.height,values=data.map(d=>d.value),min=Math.min(...values,0),max=Math.max(...values,1),range=max-min||1;
 const pts=data.map((d,i)=>({x:pad.l+i*Math.max(0,w-pad.l-pad.r)/(Math.max(1,data.length-1)),y:pad.t+(max-d.value)*(h-pad.t-pad.b)/range}));
 const stroke=svgPath(pts),fill=`${stroke} L ${pts.at(-1)?.x??pad.l} ${h-pad.b} L ${pts[0]?.x??pad.l} ${h-pad.b} Z`,colors=theme==='cute-pink'?{line:'#FF69B4',top:'rgba(255,105,180,.3)',bottom:'rgba(255,105,180,0)'}:theme==='crypto-larp'?{line:'#F7A600',top:'rgba(247,166,0,.2)',bottom:'rgba(247,166,0,0)'}:{line:'#2563EB',top:'rgba(37,99,235,.25)',bottom:'rgba(37,99,235,0)'};
 const index=hover===null?null:Math.min(data.length-1,Math.max(0,Math.round((hover-pad.l)/(w-pad.l-pad.r)*(data.length-1))));
 return <div className="chart-wrap" ref={wrap} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setHover(e.clientX-r.left)}} onMouseLeave={()=>setHover(null)} onTouchStart={e=>{const r=e.currentTarget.getBoundingClientRect();setHover(e.touches[0].clientX-r.left)}} onTouchMove={e=>{const r=e.currentTarget.getBoundingClientRect();setHover(e.touches[0].clientX-r.left)}}>
  <div className="chart-y-labels"><span>{formatCompactIDR(max)}</span><span>{formatCompactIDR((max+min)/2)}</span><span>{formatCompactIDR(min)}</span></div>
  <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Grafik tren saldo harian">
   <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors.line} stopOpacity=".3"/><stop offset="100%" stopColor={colors.line} stopOpacity="0"/></linearGradient></defs>
   {[.05,.5,.95].map(v=><line key={v} x1={pad.l} x2={w-pad.r} y1={pad.t+v*(h-pad.t-pad.b)} y2={pad.t+v*(h-pad.t-pad.b)} className="chart-grid"/>)}
   <path d={fill} fill="url(#areaGradient)"/><path d={stroke} fill="none" stroke={colors.line} strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
   {index!==null&&pts[index]&&<><line x1={pts[index].x} x2={pts[index].x} y1={pad.t} y2={h-pad.b} className="chart-crosshair"/><circle cx={pts[index].x} cy={pts[index].y} r="4.5" fill={colors.line} stroke="var(--surface)" strokeWidth="2"/></>}
  </svg>
  <div className="chart-x-labels"><span>{data[0]?.labelDate}</span><span>{data[Math.floor((data.length-1)/2)]?.labelDate}</span><span>{data.at(-1)?.labelDate}</span></div>
  {index!==null&&data[index]&&<div className="chart-tooltip" style={{left:`${Math.min(76,Math.max(15,index/Math.max(1,data.length-1)*100))}%`}}><small>{data[index].labelDate}</small><b>{formatIDR(data[index].value)}</b></div>}
 </div>
}

export function CandleChart({data}:{data:OHLCCandle[]}){
 const ref=useRef<HTMLCanvasElement>(null),wrap=useRef<HTMLDivElement>(null),[active,setActive]=useState<OHLCCandle|null>(null),size=useChartSize(wrap);
 useEffect(()=>{const canvas=ref.current;if(!canvas||!data.length)return;const dpr=window.devicePixelRatio||1;canvas.width=size.width*dpr;canvas.height=size.height*dpr;const ctx=canvas.getContext('2d');if(!ctx)return;ctx.scale(dpr,dpr);const {width:w,height:h}=size,p={l:8,r:16,t:16,b:30},min=Math.min(...data.map(c=>c.low)),max=Math.max(...data.map(c=>c.high)),range=max-min||1;ctx.clearRect(0,0,w,h);ctx.strokeStyle='var(--chart-grid)';ctx.lineWidth=1;for(let i=0;i<3;i++){let y=p.t+i*(h-p.t-p.b)/2;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke()};const slot=(w-p.l-p.r)/data.length,body=Math.max(2,slot*.58);for(let i=0;i<data.length;i++){const c=data[i],x=p.l+i*slot+slot/2,yo=p.t+(max-c.open)/range*(h-p.t-p.b),yc=p.t+(max-c.close)/range*(h-p.t-p.b),yh=p.t+(max-c.high)/range*(h-p.t-p.b),yl=p.t+(max-c.low)/range*(h-p.t-p.b),up=c.close>=c.open;ctx.strokeStyle=up?'#00C076':'#F6465D';ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(x,yh);ctx.lineTo(x,yl);ctx.stroke();ctx.fillRect(x-body/2,Math.min(yo,yc),body,Math.max(1,Math.abs(yc-yo))) }},[data,size]);
 const onPoint=useCallback((clientX:number)=>{const r=wrap.current?.getBoundingClientRect();if(!r)return;const i=Math.min(data.length-1,Math.max(0,Math.floor((clientX-r.left)/r.width*data.length)));setActive(data[i]??null)},[data]);
 return <div className="chart-wrap candle-wrap" ref={wrap} onMouseMove={e=>onPoint(e.clientX)} onMouseLeave={()=>setActive(null)} onTouchMove={e=>onPoint(e.touches[0].clientX)}><canvas ref={ref} style={{width:'100%',height:240}} aria-label="Candlestick chart"/><div className="chart-x-labels"><span>{data[0]?new Date(data[0].time*1000).toLocaleDateString('id-ID',{month:'short',year:'2-digit'}):''}</span><span>{data.at(-1)?new Date(data.at(-1)!.time*1000).toLocaleDateString('id-ID',{month:'short',year:'2-digit'}):''}</span></div>{active&&<div className="candle-tooltip"><b>O {formatIDR(active.open)} · H {formatIDR(active.high)}</b><b>L {formatIDR(active.low)} · C {formatIDR(active.close)}</b><small>{active.txCount} transaksi</small></div>}<Icon name="Chart" className="chart-accessible"/></div>
}
