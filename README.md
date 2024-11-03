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


## Options

`options.skips` an array of environments where the processing will be skipped.

`options.blocks` an array of blocks' representations. Each element of this array describes a unique pair of tags with
name, prefix, and suffix. These values are represented by a string or an object with the following properties:
```
name: 'devblock',              # string value defines the name of start/end tags (unique)
prefix: '/*',                  # string value defines the beginning of a tag
suffix: '*/',                  # string value defines the end of a tag
```


## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
