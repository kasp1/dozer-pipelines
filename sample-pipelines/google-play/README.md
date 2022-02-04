

# Intro

This is a set of scripts to help you release your Unreal Engine project on Google Play continuously (CI/CD), from either your workstation or your build server, using [Dozer, the CI/CD runner](https://github.com/kasp1/Dozer).

The pipeline is built for being run on Windows 10, but it's made with cross-platform tools. You should be able to adjust it to Linux and Mac if you need.

For support, please see the [main README page](https://github.com/kasp1/dozer-pipelines).

**Table of Contents**


- [Intro](#intro)
- [Required Environment](#required-environment)
- [Setup](#setup)
  - [Configure Your UE Project Settings](#configure-your-ue-project-settings)
  - [Configure Signing](#configure-signing)
  - [Initialize Git](#initialize-git)
    - [Getting *Commitizen*](#getting-commitizen)
  - [Get the Pipeline Scripts](#get-the-pipeline-scripts)
  - [Initialize NPM](#initialize-npm)
  - [Configure the Pipeline](#configure-the-pipeline)
  - [Get Your Google Service Key](#get-your-google-service-key)
- [Make a Script to Run the Pipeline](#make-a-script-to-run-the-pipeline)


# Required Environment

Besides an Unreal Engine installation (either the launcher or source version), and a project to deploy, you will need:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
- [Dozer](https://github.com/kasp1/Dozer) (don't forget to install Dozer as Administrator)
- [Unreal's Android requirements](https://docs.unrealengine.com/4.27/en-US/SharingAndReleasing/Mobile/Android/Reference/)

Optional handy stuff: 
- A decent code editor, [Visual Studio Code](https://code.visualstudio.com/) for instance.

Obviously, you will also need to have a Google Play Developer account set up, and an app under Google Play Console. If you are about to start a new app, it is not necessary to do all the app publishing settings, just create a new app with a name and leave it there unfinished. You will be able to upload builds to the `internal` testing branch right away.

# Setup

## Configure Your UE Project Settings

Under *Project Settings* > *Project* > *Description*:
- Set *Project Name* to anything you want to call your project.
- Set *Project Version* to exactly `1.0.0`

Under *Project Settings* > *Platforms* > *Android*:
- Click the *Configure* button at the top.
- Set *Android Package Name* to anything you like, but think twice as you can't change this after your first build is uploaded to Google Play. See also the tip below.
- Set *Store Version* to `1`.
- Check *Generate bundle (AAB)*
- Uncheck *Generate universal APK from bundle (AAB)*
- Check *Enable ABI split*
- Check *Enable language split*
- Check *Enable density split*
- Check *Support armv7*
- Check *Support arm64*
- Check *Support OpenGL ES3.1*
- *Extra permissions*: add `android.permission.INTERNET` if your app needs to access the internet.

Under *Project Settings* > *Platforms* > *Android SDK*, fill in all the 3 paths (*Android SDK*, *Android NDK*, *JAVA*).

> Pro tip: Your app's URL in Google Play will be `https://play.google.com/store/apps/details?id=YOUR_ANDROID_PACKAGE_NAME`, so this app ID also doubles as as SEO tool. I literally named some of my apps as `com.all.of.my.seo.important.keywords`, and it uploaded just fine.

## Configure Signing

Google Play requires all apps to be digitally signed before being uploaded. Therefore you need to create a signing *keystore* (a file) and configure Unreal Engine to sign the shipping files for you.

The easiest way to generate a *keystore* is by running the following commands under `yourProject/CI`:

```
npm i -g create-android-keystore
create-android-keystore quick
```

After running these two commands you should now have two files in the `CI` directory: *android-signing-info-\*.txt* and *android-\*.keystore*.

> ⚠️⚠️⚠️ These two files are super important. If you lose them, you won't be able to publish updates to your app.

Under *Project Settings* > *Platforms* > *Android*, locate the *Distribution Signing* section and fill the following:

- *Key Store* - the name of the keystore file, e.g.: `android-ydppc.keystore`
- *Key Alias* - fill in: `keyalias`
- *Key Store Password* and *Key Password* - these can be found in the *android-signing-info-\*.txt* file

The pipeline will automatically copy the keystore file to the Android build folder (`yourProject/Build/Android`).

## Initialize Git

Your project needs to be versioned by Git for the purposes of this pipeline. If you haven't done so yet, run the `git init` command in your repository.

After each significant change in your project, you should make a git commit with a semantic commit message (see [https://semver.org/](https://semver.org/)). In practice, this means commit messages like:
```
feat: added a sniper rifle to the game
```
which would translate in commit command:
```
git commit -m "feat: added a sniper rifle to the game"
```

You can either use the Unreal Editor to make such commit messages, or alternatively, you can use a command line tool for making semantic commits called *Commitizen*. After installing this tool, you effectively gain a new Git command. Instead of running `git commit -m "message"`, you run `git cz`, which fires up a wizard guiding you through making a semantic commit message.

[Why you will love semantic versioning with Git?](https://github.com/kasp1/dozer-pipelines#versioning-and-changelogs)

### Getting *Commitizen*
```
npm install -g commitizen
```

## Get the Pipeline Scripts

All contents of this directory are supposed to sit under the `CI/shared` folder in the root of your Unreal Engine project. Just click the *Code* button at the top of this page and select the *Download ZIP* option. Then extract everything to `your_UE_project/CI/shared`.

Alternatively, you can run the following command from the root of your Unreal project to clone the pipeline scripts from this repository under the CI folder as a Git submodule:

```
git submodule add https://github.com/kasp1/dozer-pipelines.git CI/shared
```

## Initialize NPM

NPM is a package manager installed with NodeJS by default. Since this pipeline uses NodeJS to run the automation scripts, we will need to install some NodeJS packages using NPM.

Copy `yourProject/CI/shared/sample-pipelines/sample-package.json` to `yourProject/package.json`.

Then run the following command in your project's root:

```
npm install
```

All the necessary packages should get installed automatically.

> The newly created `node_modules` folder in your project root should be excluded from Git versioning (add it to .gitignore), while the `package.json` and `package-lock.json` files should be included in Git versioning.

## Configure the Pipeline

The pipeline needs to know some specific info about your project. Copy `yourProject/CI/shared/sample-pipelines/google-play/vars.bat` to `yourProject/CI/vars.bat` and edit its contents to correspond with your project.

This file is a simple key-value setting script.

- **CI_UE_HOME** - path to your local Unreal Engine installation
- **CI_SERVICE_KEY** - see below
- **CI_PACKAGE_NAME** - same thing as you have filled in your *Project Settings* > *Platforms* > *Android* > *Android Package Name*
- **CI_PACKAGE_BUNDLE** - path to the file built by Unreal Engine for shipping
- **CI_PACKAGE_EXPANSIONS_DIR** - path to the directory where the expansion files generated by Unreal Engine are located
- **CI_DEFAULT_GOOGLEPLAY_TRACK** - default Google Play publishing track, leave it as `internal` if you don't understand yet

## Get Your Google Service Key

In order to access the Google Play Console programmatically to let this pipeline upload your builds, you need to authenticate with Google's servers. There are two options: OAuth and Service Account. You want a service account. Then you need to give this service account access to uploading apps in Google Play Console.

Normally, when you want programmatic access to an online service (an API), you go and generate an API key somewhere in your account settings and use it for authentication. But here you don't go to Google Play Console, but to Google Cloud Console instead. This is probably more complicated than it could be but Google is a large complex company, and they need to keep their systems modular somehow in order to keep their development going. In Google Cloud Console you can basically get programmatic access to all of the Google APIs out there, including YouTube, GMail, and Google Play Console.

[Here](https://developers.google.com/android-publisher/getting_started) is Google's guide to setting up a service account, linking it with the Google Play Console, and giving it access to your specific Google Play Console app.

You will be guided to create an access key for your service account, which can be downloaded as a JSON file. Just download it and save it as `CI/google-service-key.json`. The entire JSON file should be generated for you, and you shouldn't need to edit it. Here's an example of such a file:

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "SUPER LONG PRIVATE KEY",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/google-play..."
}
```

# Make a Script to Run the Pipeline

From now on, every time you will want to deploy a version of your app to the Google Play *internal* testing branch (from where you can later publish it to the *alpha*, *beta*, and *production* branches.), you can simply run the following command in your project's root:

```
dozer CI\shared\sample-pipelines\google-play\deploy.yaml --gui
```

The `--gui` part will also start a graphical interface showing you the progress of the build. Typically you want to start GUI on your workstation but on your build server you will probably want to omit `--gui`.

You can also make a new file in your project's root called `deploy.bat`, and just put this command in it. When you click it, the deployment should automatically start. That's easier than typing the command every time or trying to remember it.

> If you created a file called `deploy.bat`, but it opens as a text file when you click it, instead of starting the pipeline, chances are you have hidden file extensions in Windows, and the file is called `deploy.bat.txt` instead.

> If you've just set up a fresh new app in Google Play Console, and you are about to upload the first build, you will need to upload it manually, because the Google Play Console, doesn't know your app ID yet (*com.YourAppName*). As the Google Play Console can only read the app ID from your first uploaded build. Simply run the pipeline for the first time and let it fail on the upload. Then go to `yourProject/Distribution`, find the `.aab` file, create a new internal branch release manually and upload this file. Subsequent runs of the deployment pipeline should succeed the upload.
