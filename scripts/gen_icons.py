from PIL import Image, ImageDraw
import os
r = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'android', 'app', 'src', 'main', 'res')
bg = '#0B0E11'
line = '#F7A600'
dot = '#00C076'
sizes = {
 'mipmap-mdpi':48,'mipmap-hdpi':72,'mipmap-xhdpi':96,'mipmap-xxhdpi':144,'mipmap-xxxhdpi':192,
}
for folder, s in sizes.items():
    img = Image.new('RGBA',(s,s),bg)
    d = ImageDraw.Draw(img)
    pad = int(s*0.22)
    pts = [(pad, int(s*0.62)), (int(s*0.38), int(s*0.42)), (int(s*0.58), int(s*0.56)), (s-pad, int(s*0.27))]
    d.line(pts, fill=line, width=max(2,int(s*0.075)), joint='curve')
    rad = max(2,int(s*0.07))
    x,y = pts[-1]
    d.ellipse([x-rad,y-rad,x+rad,y+rad], fill=dot)
    p=os.path.join(r,folder)
    img.save(os.path.join(p,'ic_launcher.png'))
    img.save(os.path.join(p,'ic_launcher_round.png'))
    fg=img.copy(); bgtransp=Image.new('RGBA',(s,s),(0,0,0,0)); bgtransp.paste(fg,(0,0)); fg.save(os.path.join(p,'ic_launcher_foreground.png'))
    print(folder,s,'ok')
# splash (portrait 480x800 baseline scale)
for folder,w,h in [('drawable-port-mdpi',480,800),('drawable-port-hdpi',720,1200),('drawable-port-xhdpi',960,1600),('drawable-port-xxhdpi',1440,2400),('drawable-port-xxxhdpi',1920,3200),('drawable',480,800)]:
    img=Image.new('RGBA',(w,h),bg)
    s=min(w,h)//4
    cx,cy=w//2,h//2-s//3
    d=ImageDraw.Draw(img)
    pad=int(s*0.22)
    pts=[(cx-s//2+pad,cy+int(s*0.12)),(cx-s//2+int(s*0.38),cy-int(s*0.08)),(cx-s//2+int(s*0.58),cy+int(s*0.06)),(cx+s//2-pad,cy-int(s*0.23))]
    d.line(pts,fill=line,width=max(3,int(s*0.075)),joint='curve')
    rad=max(3,int(s*0.07)); x,y=pts[-1]; d.ellipse([x-rad,y-rad,x+rad,y+rad],fill=dot)
    img.save(os.path.join(r,folder,'splash.png'))
    print(folder,w,h,'ok')
