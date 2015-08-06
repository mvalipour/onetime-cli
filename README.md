# onetime-cli
[![travis](https://travis-ci.org/mvalipour/onetime-cli.svg?branch=master)](https://travis-ci.org/mvalipour/onetime-cli)

Manage harvest and target-process in one place from command line.

![](http://www.reactiongifs.com/wp-content/uploads/2013/02/aaaand-send.gif)

## Install

```
npm install -g onetime-cli
```

## Usage

```
onetime -h
```

To expert using onetime see [the tutorial on our wiki](https://github.com/mvalipour/onetime-cli/wiki/Tutorial)

## Features

- **Aliases**: You can define named aliases to make starting regular times easier.
- **Project settings**: You can define a `.onetime` file in the root of your project and specify which project to be used when starting time from that directory.
- **Finish time**: Finishing a time will stop the timer on harvest and (if any) will log the time on target process. You can choose a time to finish or bulk finish all times of a specific day (default to today).
- **Restart a time**: Restart one of your older timers with exact same details to avoid
adding details over and over again.

## Develop

```
git clone https://github.com/mvalipour/onetime-cli.git
cd onetime-cli
npm install
npm link
```
