#!/usr/bin/env python3
"""Build APK release: cap sync + gradle assembleRelease, pakai toolchain lokal .toolchain/."""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TC = os.path.join(ROOT, '.toolchain')
JDK = os.path.join(TC, 'jdk')
SDK = os.path.join(TC, 'android-sdk')
ANDROID = os.path.join(ROOT, 'android')
env = dict(os.environ)
env.update(JAVA_HOME=JDK, ANDROID_HOME=SDK, ANDROID_SDK_ROOT=SDK,
           PATH=os.path.join(JDK, 'bin') + os.pathsep + os.environ['PATH'])
env.setdefault('GRADLE_USER_HOME', os.path.join(TC, 'gradle-home'))

def run(args, cwd=ROOT, **kw):
    print('+', ' '.join(args), flush=True)
    r = subprocess.run(args, cwd=cwd, env=env, text=True, encoding='utf-8', errors='replace', **kw)
    if r.returncode != 0:
        print((r.stdout or '')[-3000:]); print((r.stderr or '')[-3000:]); sys.exit(f'gagal: {args[0]}')
    return r

run(['npm', 'run', 'build'], shell=(os.name == 'nt'))
run(['npx', 'cap', 'sync', 'android'], shell=(os.name == 'nt'))
gradlew = os.path.join(ANDROID, 'gradlew.bat') if os.name == 'nt' else os.path.join(ANDROID, 'gradlew')
run([gradlew, 'assembleRelease', '--no-daemon', '--console=plain'], cwd=ANDROID)

apk = os.path.join(ANDROID, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
print('APK', apk, os.path.getsize(apk), 'bytes')
