@REM Unreal Engine Build
echo ##CI_UE_HOME=%UE4.26_HOME%#

@REM Google Play Publishing
echo ##CI_SERVICE_KEY=CI/google-service-key.json#
echo ##CI_PACKAGE_NAME=com.your.app#
echo ##CI_PACKAGE_BUNDLE=Distribution/Android_Multi/YourApp-Android-Shipping.aab#
echo ##CI_PACKAGE_EXPANSIONS_DIR=Distribution/Android_Multi#
echo ##CI_DEFAULT_GOOGLEPLAY_TRACK=internal#