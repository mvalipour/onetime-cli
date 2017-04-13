# onetime-cli
[![travis](https://travis-ci.org/mvalipour/onetime-cli.svg?branch=master)](https://travis-ci.org/mvalipour/onetime-cli)

A command line interface to manage harvest and target-process in one place.

![](http://www.reactiongifs.com/wp-content/uploads/2013/02/aaaand-send.gif)

## Install

You need to set up your MyGet authentication and then install the package.

1. Run `npm adduser --registry=https://www.myget.org/F/neworbit/npm/` and follow the prompts (use your MyGet authentication)
2. Run `npm config set @neworbit:always-auth true`
3. Run `npm install -g @neworbit/onetime-cli`

## Usage

Type the following to get usage information:

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

## Contributing

Found a bug or have an idea? [Open a new issue](https://github.com/mvalipour/onetime-cli/issues/new) and let's discuss it :)

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

### Run the cli on development mode

```
npm install
npm link
```

## License

Developed and maintained by [Mo Valipour](https://github.com/mvalipour).

See license info [here](https://github.com/mvalipour/onetime-cli/blob/master/license.txt).
