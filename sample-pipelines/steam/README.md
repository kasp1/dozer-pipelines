

# Intro

This is a set of scripts to help you release your Unreal Engine project on Steam continuously (CI/CD), from either your workstation or your build server, using [Dozer, the CI/CD runner](https://github.com/kasp1/Dozer).

The pipeline is built for being run on Windows 10, but it's made with cross-platform tools. You should be able to adjust it to Linux and Mac if you need.

For support, please see the [main README page](https://github.com/kasp1/dozer-pipelines).

**Table of Contents**


- [Intro](#intro)
- [Required Environment](#required-environment)
- [Setup](#setup)
  - [Configure Your UE Project Settings](#configure-your-ue-project-settings)
  - [Initialize Git](#initialize-git)
    - [Getting *Commitizen*](#getting-commitizen)
  - [Get the Pipeline Scripts](#get-the-pipeline-scripts)
  - [Initialize NPM](#initialize-npm)
  - [Get Your VDF](#get-your-vdf)
  - [Configure the Pipeline](#configure-the-pipeline)
- [Make a Script to Run the Pipeline](#make-a-script-to-run-the-pipeline)


# Required Environment

Besides an Unreal Engine installation (either the launcher or source version), and a project to deploy, you will need:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
- [Dozer](https://github.com/kasp1/Dozer) (don't forget to install Dozer as Administrator)
- [Steamworks SDK Downloaded and Unzipped](https://partner.steamgames.com/doc/sdk)
- [Steamguard CLI](https://github.com/dyc3/steamguard-cli) set up, on Windows 10 you might need to use the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install) to run it. ⚠️ You should create a new Steam account for running this pipeline, so in case anything screws up during the setup, your main Steam account is not affected.

Optional handy stuff: 
- A decent code editor, [Visual Studio Code](https://code.visualstudio.com/) for instance.

Obviously, you will also need to have a Steam developer account set up, and an app under Steamworks.

# Setup

## Configure Your UE Project Settings

Under *Project Settings* > *Project* > *Description*:
- Set *Project Version* to exactly `1.0.0`


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

## Get Your VDF

Content builder is a program distributed with Steamworks SDK which actually uploads your app's build.

[Here is a comprehensive guide](https://partner.steamgames.com/doc/sdk/uploading) on how to set up your Steam branches, and create a VDF file for your app, e.g. `steamcmd_app.vdf`.

The pipeline will then use this VDF file with Content Builder to upload your app to Steam.

## Configure the Pipeline

The pipeline needs to know some specific info about your project. Copy `yourProject/CI/shared/sample-pipelines/steam/vars.bat` to `yourProject/CI/vars.bat` and edit its contents to correspond with your project.

This file is a simple key-value setting script.

- **CI_UE_HOME** - path to your local Unreal Engine installation
- **CI_UE_UPROJECT** - the *.uproject* file of your Unreal Engine project
- **CI_STEAMGUARD_CLI** - command to run the Steamguard CLI
- **CI_STEAM_SDA_DIR** - directory where your SDA files are located, usually somewhere under *Steam Desktop Authenticator*'s folder, which you should have set up along with Steamguard CLI.
- **STEAM_LOGIN** - your upload Steam account's login (use a separate account for uploads)
- **STEAM_PASSWORD** - your upload Steam account's password
- **CI_STEAM_VDF** - path to the VDF file for use with Content Builder
- **CI_STEAM_BUILDER_DIR** - path to the Content Builder's directory under Steamworks SDK, e.g. `%STEAMWORKS_SDK_HOME%\\tools\\ContentBuilder\\builder`

# Make a Script to Run the Pipeline

From now on, every time you will want to deploy a version of your app to Steam, you can simply run the following command in your project's root:

```
dozer CI\shared\sample-pipelines\steam\deploy.yaml --gui
```

The `--gui` part will also start a graphical interface showing you the progress of the build. Typically you want to start GUI on your workstation but on your build server you will probably want to omit `--gui`.

You can also make a new file in your project's root called `deploy.bat`, and just put this command in it. When you click it, the deployment should automatically start. That's easier than typing the command every time or trying to remember it.

> If you created a file called `deploy.bat`, but it opens as a text file when you click it, instead of starting the pipeline, chances are you have hidden file extensions in Windows, and the file is called `deploy.bat.txt` instead.

