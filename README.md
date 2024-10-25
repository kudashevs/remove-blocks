Remove Blocks ![test workflow](https://github.com/kudashevs/remove-blocks/actions/workflows/run-tests.yml/badge.svg)
==========================

The `remove-blocks` is a small library that removes marked blocks from any type of code.


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
label: 'development',          # string value defines star and end labels of a block to remove
start: '/*',                   # string value defines a start of a block
end: '*/',                     # string value defines an end of a block
```


## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
