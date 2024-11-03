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

To describe different blocks, use the `blocks` array. Each element of this array describes a unique block to be removed
and is represented by an object the following configuration properties:
```
name: 'devblock',              # string value defines the name of start/end tags (unique)
prefix: '/*',                  # string value defines the beginning of a tag
suffix: '*/',                  # string value defines the end of a tag
```


## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
