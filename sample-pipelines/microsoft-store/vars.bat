@REM Unreal Engine Build
echo ##CI_UE_HOME=%UE5.0_HOME%#

@REM Windows Publishing
echo ##APP_NAME=AppName#
echo ##APP_DESCRIPTION=App description.#
@REM The following is the app .exe generated by Unreal Engine build under Distribution\Windows
echo ##MSIX_EXE=<project name>.exe#
echo ##MSIX_RESOURCES=CI\shared\sample-pipelines\microsoft-store\resources#
echo ##MSIX_LOGO_44=SampleLogo44.png#
echo ##MSIX_LOGO_150=SampleLogo150.png#
echo ##MSIX_APPLOGO=SampleLogo200x150.png#
echo ##MSIX_BGCOLOR_HEX=464646#
echo ##PUBLISHER=PublisherName#
echo ##PUBLISHER_ACCOUNT=PublisherNameAsOnMicrosoftStore#
echo ##PUBLISHER_FAMILY=_something#
echo ##PUBLISHER_UUID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX#