

# Intro

This is a set of scripts to help you release your Unreal Engine Plugin on the Unreal Engine Marketplace, from either your workstation or your build server, using [Dozer, the CI/CD runner](https://github.com/kasp1/Dozer).

The pipeline is built for being run on Windows 10, but it's made with cross-platform tools. You should be able to adjust it to Linux and Mac if you need.

For support, please see the [main README page](https://github.com/kasp1/dozer-pipelines).

This pipeline is tailored for Code Plugins. For content-only plugins, you can copy the pipeline's YAML and comment-out the build test against various UE versions.

**Table of Contents**


- [Intro](#intro)
- [Required Environment](#required-environment)
- [Setup](#setup)
  - [Create Your Plugin](#create-your-plugin)
  - [Create .uplugin for Test Builds](#create-uplugin-for-test-builds)
  - [Set Your Env Vars to UE Installations](#set-your-env-vars-to-ue-installations)
  - [Initialize Git](#initialize-git)
    - [Getting *Commitizen*](#getting-commitizen)
  - [Get the Pipeline Scripts](#get-the-pipeline-scripts)
  - [Initialize NPM](#initialize-npm)
  - [Get Your VDF](#get-your-vdf)
- [Make a Script to Run the Pipeline](#make-a-script-to-run-the-pipeline)


# Required Environment

Besides an Unreal Engine installation (either the launcher or source version), and a project to deploy, you will need:

- [Git](https://git-scm.com/)
- [NodeJS](https://nodejs.org/)
- [Dozer](https://github.com/kasp1/Dozer) (don't forget to install Dozer as Administrator)
- Unreal Engine installations of versions you want to test builds against. According to the Marketplace Guidelines, you should test builds against the last 3 major UE versions.

Optional handy stuff: 
- A decent code editor, [Visual Studio Code](https://code.visualstudio.com/) for instance.


# Setup

## Create Your Plugin

If you haven't done it yet, you can create your plugin using the wizard. See *Creating New Plugins* at [this page](https://docs.unrealengine.com/4.27/en-US/ProductionPipelines/Plugins/).

## Create .uplugin for Test Builds

It seems like testing builds requires a separate version of your `.uplugin` file with slightly different settings. Copy/paste your `.uplugin` file into a new `.uplugin-testbuild` file in the same directory.

The pipeline will automatically use this `.uplugin-testbuild` file for build test instead of the actual `.uplugin`. So you can feel free to tweak the build settings here as you wish. The package of your plugin built for distribution will contain the original `.uplugin` file.

You may need to do the following changes to the `.uplugin-testbuild` for your test builds to succeed:
- **WhitelistPlatforms**: `[ "Win64" ]`
- **Modules** > **Type**: `Developer`


## Set Your Env Vars to UE Installations

For each UE installation that you want to test builds against, set an environment variable with the format of `UE<version>_HOME`:

- `UE4.25_HOME`
- `UE4.26_HOME`
- `UE4.27_HOME`

The pipeline is premade to test against these versions, but you can change it to anything you need, including the env var names.


## Initialize Git

Your plugin needs to be versioned by Git for the purposes of this pipeline. If you haven't done so yet, run the `git init` command in your repository (your plugin's root).

If you are developing your plugin under a UE project, which itself is Git-versioned, you might want to add your plugin as a Git-submodule into your UE project.

After each significant change in your plugin, you should make a git commit with a semantic commit message (see [https://semver.org/](https://semver.org/)). In practice, this means commit messages like:
```
feat: added a sniper rifle to the game
```
which would translate in commit command:
```
git commit -m "feat: added a cool new feature to the plugin"
```

You can either use the Unreal Editor to make such commit messages, or alternatively, you can use a command line tool for making semantic commits called *Commitizen*. After installing this tool, you effectively gain a new Git command. Instead of running `git commit -m "message"`, you run `git cz`, which fires up a wizard guiding you through making a semantic commit message.

[Why you will love semantic versioning with Git?](https://github.com/kasp1/dozer-pipelines#versioning-and-changelogs)

### Getting *Commitizen*
```
npm install -g commitizen
```

## Get the Pipeline Scripts

All contents of this directory are supposed to sit under the `Plugins/YourPlugin/CI/shared` folder in the root of your Unreal Engine project. Just click the *Code* button at the top of this page and select the *Download ZIP* option. Then extract everything to `your_UE_project/Plugins/YourPlugin/CI/shared`.

> If you followed any pipeline setup for publishing a UE project, and now you want to develop a plugin with CI/CD under the same project, please note that we are distinguishing two different pipelines here: `your_UE_project/CI` runs publishing of your UE project, while `your_UE_project/Plugins/YourPlugin/CI` runs publishing of your Marketplace Plugin.

Alternatively, you can run the following command from the root of your **plugin** (not the root of your UE project) to clone the pipeline scripts from this repository under the CI folder as a Git submodule:

```
git submodule add https://github.com/kasp1/dozer-pipelines.git CI/shared
```

## Initialize NPM

NPM is a package manager installed with NodeJS by default. Since this pipeline uses NodeJS to run the automation scripts, we will need to install some NodeJS packages using NPM.

Copy `yourProject/Plugins/YourPlugin/CI/shared/sample-pipelines/sample-package.json` to `yourProject/Plugins/YourPlugin/package.json`.

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

# Make a Script to Run the Pipeline

From now on, every time you will want to deploy a version of your app to Steam, you can simply run the following command in your project's root:

```
dozer CI\shared\sample-pipelines\unreal-marketplace-code-plugin\prepare.yaml --gui
```

The `--gui` part will also start a graphical interface showing you the progress of the build. Typically you want to start GUI on your workstation but on your build server you will probably want to omit `--gui`.

You can also make a new file in your plugins's root called `prepare.bat`, and just put this command in it. When you click it, the deployment should automatically start. That's easier than typing the command every time or trying to remember it.

After running the above script/command, you should find your plugin prepared for uploading to the UE Marketplace under the `Distribution` folder.

