Remove Blocks ![test workflow](https://github.com/kudashevs/remove-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

The `remove-blocks` is a library that removes marked blocks from any type of code.


## Install

```bash
# NPM
npm install --save-dev remove-blocks
# Yarn
yarn add --dev remove-blocks
```


## Usage

It removes blocks of code marked with two paired tags. A pair of tags consists of a start tag and an end tag. The format
of each tag is `prefix name:position suffix` (e.g. `/* debug:start */`). The name, prefix, and suffix are configurable.
```js
/* debug:start */ 
console.log('debug');
/* debug:end */
```

**Note**: The blocks cannot overlap each other.


## Options

`options.skips` an array of environments where the processing will be skipped.

`options.blocks` an array of blocks' representations. Each element of this array describes a unique pair of tags with
name, prefix, and suffix. These values are represented by an object with the mandatory properties or by a string:
```
name: 'devblock',              # a string defines a name for the start/end tags (unique)
prefix: '/*',                  # a string defines the beginning of a tag (non-empty string)
suffix: '*/',                  # a string defines the end of a tag (can be an empty string)
```
When a pair of tags is represented by a string, the default prefix and suffix are used (e.g. `/*` and `*/`).


## License

The MIT License (MIT). Please see the [License file](LICENSE.md) for more information.