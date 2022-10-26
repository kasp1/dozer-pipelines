@REM Unreal Engine Build
echo ##CI_UE_HOME=%UE4.26_HOME%#

@REM Steam Publishing
echo ##CI_STEAMGUARD_CLI=wsl /home/ubuntu/steamguard-cli/build/steamguard#
echo ##CI_STEAM_SDA_DIR=path/to/SDA/maFiles#
echo ##STEAM_LOGIN=username#
echo ##STEAM_PASSWORD=password#
echo ##CI_STEAM_VDF=path/to/steamcmd_app.vdf#
echo ##CI_STEAM_BUILDER_DIR=%STEAMWORKS_SDK_HOME%\\tools\\ContentBuilder\\builder#