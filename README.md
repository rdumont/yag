# yag
Yet Another Git-tag-version-release-tool

Because calling it yagtvrt would be a bit too much, right? 

## Use case

This tool is meant for making releases of repositories that use Git version
tags following Semantic versioning. With one command, it will:

1. Update your `package.json` file with the new version (e.g. from `1.2.3` to `1.3.0`)
2. Commit the file with message `Release v1.3.0` and tag it as `v1.3.0`
3. Push the branch and the new tag to upstream repository

## Installation

Install the global NPM package, using:

As CLI tool:
```
$ npm install -g yag
```

As library:
```
$ npm install yag --save
```

## Usage

### As CLI tool

See `yag --help`:

```
Usage
  $ yag [<type>] [options...]

Types
  major     Increments the major component (1.x.y -> 2.0.0)
  minor     Increments the minor component (x.1.y -> x.2.0)
  patch     Increments the minor component (x.y.1 -> x.y.2)
  pre       Increments the pre-release component (x.y.z-beta.1 -> x.y.z-beta.2)
  promote   Removes the pre-release component (x.y.z-beta -> x.y.z)

Options
  -h --help     Show this screen
  -v --version  Show version
  -s --stable   Bump directly to stable version, skipping pre-release
  -t --tag      The pre-release tag name (default: beta)
  -y            Do not ask for confirmation at each step
```

### As library

```js
import {bump, release} from 'yag'

let newVersion = bump('1.2.3', 'minor', {tag: 'alpha'})
/* newVersion -> 1.3.0-alpha
The accepted options are 'tag' and 'stable', with the same behavior as the CLI.
*/

release('minor', {tag: 'alpha'})
/*
This is intended for command line tool usage
and will behave the same as the `yag` command.
The accepted options are 'tag', 'stable' and 'unattended' (for `-y`)
*/
```

## Notes

### Scripts

You can define hook scripts in your `package.json` that will be called by `yag`:

#### `prerelease`
Will be called before anything is done, even before updating the version.

**Use case**: run tests to ensure that you are releasing a working version.

#### `onrelease`
Will be called after patching the `package.js` file, but before committing.

**Use case**: update some other file according to the new version and put it
in the same commit.

#### `postrelease`
Will be called at the end, after pushing the changes.

**Use case**: publish an NPM package for the new release. 

### Default increment types

When the current version is a pre-release, the default increment will be `pre`.
Otherwise, it will be `patch`. Examples:

* `1.2.3` -> `yag` -> `1.2.4-beta`
* `1.2.3-beta` -> `yag` -> `1.2.3-beta.0` 

### Beta by default

Unless explicitly specified with the `--stable` options, every increment type
(except for `promote`, obviously) will increment to a `beta` version. Examples:

* `1.2.3` -> `yag minor` -> `1.3.0-beta`
* `1.2.3` -> `yag minor --stable` -> `1.3.0`
