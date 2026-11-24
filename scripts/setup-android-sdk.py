#!/usr/bin/env python3
"""Setup toolchain Android lokal di .toolchain/ (gitignored). JDK 17 + cmdline-tools."""
import os, subprocess, sys, urllib.request, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TC = os.path.join(ROOT, '.toolchain')
SDK = os.path.join(TC, 'android-sdk')
JDK = os.path.join(TC, 'jdk')
SM = os.path.join(SDK, 'cmdline-tools', 'latest', 'bin', 'sdkmanager.bat')

URLS = {
    os.path.join(TC, 'jdk.zip'): 'https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk',
    os.path.join(TC, 'cmdtools.zip'): 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip',
}

def fetch(dest, url):
    if os.path.exists(dest):
        return
    print('download', os.path.basename(dest))
    urllib.request.urlretrieve(url, dest)

def unzip_to(src, dest, strip=None):
    with zipfile.ZipFile(src) as z:
        z.extractall(dest)
    if strip:
        inner = os.path.join(dest, strip)
        for name in os.listdir(inner):
            os.replace(os.path.join(inner, name), os.path.join(dest.replace(strip, ''), name)) if False else None

os.makedirs(TC, exist_ok=True)
for dest, url in URLS.items():
    fetch(dest, url)

if not os.path.isdir(JDK):
    tmp = os.path.join(TC, 'tmpjdk')
    unzip_to(os.path.join(TC, 'jdk.zip'), tmp)
    inner = os.path.join(tmp, os.listdir(tmp)[0])
    os.rename(inner, JDK)

if not os.path.isdir(os.path.join(SDK, 'cmdline-tools', 'latest')):
    tmp = os.path.join(TC, 'tmpcmd')
    unzip_to(os.path.join(TC, 'cmdtools.zip'), tmp)
    os.makedirs(os.path.join(SDK, 'cmdline-tools'), exist_ok=True)
    os.rename(os.path.join(tmp, 'cmdline-tools'), os.path.join(SDK, 'cmdline-tools', 'latest'))

env = dict(os.environ, JAVA_HOME=JDK, ANDROID_HOME=SDK, ANDROID_SDK_ROOT=SDK,
           PATH=os.path.join(JDK, 'bin') + os.pathsep + os.environ['PATH'])

def run(args, **kw):
    print('+', ' '.join(args))
    return subprocess.run(args, env=env, capture_output=True, text=True, **kw)

run([SM, '--sdk_root=' + SDK, '--licenses'], input='y\n' * 40)
r = run([SM, '--sdk_root=' + SDK, 'platform-tools', 'platforms;android-34', 'build-tools;34.0.0'])
print((r.stdout or '')[-800:], (r.stderr or '')[-800:])
if r.returncode != 0:
    sys.exit('sdkmanager gagal')

with open(os.path.join(ROOT, 'android', 'local.properties'), 'w') as f:
    f.write('sdk.dir=' + SDK.replace('\\', '/') + '\n')
print('SETUP_OK', SDK)
