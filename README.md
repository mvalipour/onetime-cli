# onetime-cli

Manage harvest and target-proess in one place from command line.

## Install

```
npm install -g onetime-cli
```

## Usage

```
onetime -h
```

## Features

- **Aliases**: You can define named aliases to make starting regular times easier.
- **Project settings**: You can define a `.onetime` file in the root of your project and specify which project to be used when starting time from that directory.
- **Finish time**: Finishing a time will stop the timer on harvest and (if any) will log the time on target process. You can chooe a time to finish to bulk finish all times of a specific day (default to today).

## Develop

```
git clone https://github.com/mvalipour/onetime-cli.git
cd onetime-cli
npm install
npm link
```
