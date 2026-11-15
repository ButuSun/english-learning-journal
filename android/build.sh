#!/usr/bin/env bash
set -euo pipefail
# Run from the repository root. Signing material must stay outside the repository.
: "${ANDROID_SDK_ROOT:?Set ANDROID_SDK_ROOT}"
: "${ECJ_JAR:?Set ECJ_JAR}"
: "${SIGNING_KEY:?Set SIGNING_KEY}"
: "${SIGNING_PASSWORD_FILE:?Set SIGNING_PASSWORD_FILE}"
BT="$ANDROID_SDK_ROOT/build-tools/35.0.0"
PLATFORM="$ANDROID_SDK_ROOT/platforms/android-35/android.jar"
BUILD="${BUILD_DIRECTORY:-/tmp/writing-apk-build}"
mkdir -p "$BUILD/classes" "$BUILD/assets"
node scripts/build-mobile.mjs
cp mobile/index.html mobile/app.js mobile/style.css mobile/data.json mobile/version.json "$BUILD/assets/"
java -jar "$ECJ_JAR" -1.8 -bootclasspath "$PLATFORM:$BT/core-lambda-stubs.jar" -d "$BUILD/classes" android/src/com/butusun/writing/MainActivity.java
"$BT/d8" --lib "$PLATFORM" --min-api 26 --output "$BUILD" $(find "$BUILD/classes" -name '*.class')
"$BT/aapt" package -f -M android/AndroidManifest.xml -S android/res -A "$BUILD/assets" -I "$PLATFORM" -F "$BUILD/unsigned.apk"
(cd "$BUILD" && "$BT/aapt" add unsigned.apk classes.dex)
"$BT/zipalign" -f 4 "$BUILD/unsigned.apk" "$BUILD/aligned.apk"
"$BT/apksigner" sign --ks "$SIGNING_KEY" --ks-key-alias journal --ks-pass "file:$SIGNING_PASSWORD_FILE" --out "$BUILD/writing-calendar-1.0.0.apk" "$BUILD/aligned.apk"
"$BT/apksigner" verify --verbose "$BUILD/writing-calendar-1.0.0.apk"
