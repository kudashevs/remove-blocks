const {describe, it, expect} = require('@jest/globals');
const sut = require('../../lib/validator');
const schema = require('../../lib/options.json');

describe('options validator test suite', () => {
  it('passes when options value is an empty object', () => {
    expect(() => sut(schema, {})).not.toThrow(Error);
  });

  it('fails when options value is not an object', () => {
    const options = [];

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual('must be an object');
    }
    expect.assertions(1);
  });

  it('fails when options.skips value is not an array', () => {
    const options = {skips: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual('skips option must be an array');
    }
    expect.assertions(1);
  });

  it.each([
    ['first value is not a string', {skips: [42]}, 'skips.0 should be a string'],
    ['first value is an empty string', {skips: ['']}, 'skips.0 should be a non empty string'],
    ['second value is an empty string', {skips: ['test', '']}, 'skips.1 should be a non empty string'],
  ])('fails when in options.skips the %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual(expected);
    }
    expect.assertions(1);
  });

  it('fails when options.blocks value is not an array', () => {
    const options = {blocks: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual('blocks option must be an array');
    }
    expect.assertions(1);
  });

  it.each([
    ['first value is not a string neither an object', {blocks: [42]}, 'blocks.0 should be a string or a valid object'],
    ['first value is an empty string', {blocks: ['']}, 'blocks.0 should be a non empty string'],
    ['first value is an empty object', {blocks: [{}]}, 'blocks.0 should be a valid object with name, prefix, suffix'],
  ])('fails when in options.blocks the %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(expected);
    }
    expect.assertions(1);
  });

  it.each([
    [
      'name in the first element is wrong',
      {
        blocks: [{name: 42, prefix: 'any', suffix: 'any'}],
      },
      /^blocks.0.name should be a string/,
    ],
    [
      'prefix in the first element is wrong',
      {
        blocks: [{name: 'any', prefix: 42, suffix: 'any'}],
      },
      /^blocks.0.prefix should be a string/,
    ],
    [
      'suffix in the first element is wrong',
      {
        blocks: [{name: 'any', prefix: 'any', suffix: 42}],
      },
      /^blocks.0.suffix should be a string/,
    ],
    [
      'prefix and suffix in the first element are wrong',
      {
        blocks: [{name: 'any', prefix: 42, suffix: 42}],
      },
      /^blocks.0.prefix should be a string and blocks.0.suffix should be a string/,
    ],
    [
      'name in the second element is wrong',
      {
        blocks: [
          {name: 'any', prefix: 'any', suffix: 'any'},
          {name: 42, prefix: 'any', suffix: 'any'},
        ],
      },
      /^blocks.1.name should be a string/,
    ],
  ])('fails when options.blocks type of the %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(expected);
    }
    expect.assertions(1);
  });

  it.each([
    [
      'first element is an object without name',
      {
        blocks: [{prefix: 'any', suffix: 'any'}],
      },
      /^blocks.0 should be a valid object/,
    ],
    [
      'first element is an object with empty name',
      {
        blocks: [{name: '', prefix: 'any', suffix: 'any'}],
      },
      'name should be a non empty string',
    ],
    [
      'first element is an object with empty prefix',
      {
        blocks: [{name: 'any', prefix: '', suffix: 'any'}],
      },
      'prefix should be a non empty string',
    ],
    [
      'second element is an empty string',
      {
        blocks: [{name: 'any', prefix: 'any', suffix: 'any'}, ''],
      },
      'blocks.1 should be a non empty string',
    ],
    [
      'second element is an empty object',
      {
        blocks: [{name: 'any', prefix: 'any', suffix: 'any'}, {}],
      },
      'blocks.1 should be a valid object with name, prefix, suffix',
    ],
    [
      'second element is an object without name',
      {
        blocks: [
          {name: 'any', prefix: 'any', suffix: 'any'},
          {prefix: 'any', suffix: 'any'},
        ],
      },
      /^blocks.1 should be a valid object/,
    ],
  ])('fails when options.blocks value of the %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(expected);
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first value is an object without suffix and empty name and prefix', () => {
    const options = {
      blocks: [{name: '', prefix: '', any: 'any'}],
    };

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(
        /^blocks.0 should be a valid object with name, prefix, suffix and blocks.0.name.+and.+prefix/,
      );
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first value is an object that breaks all of the rules', () => {
    const options = {
      blocks: [{name: '', prefix: '', suffix: 42}],
    };
    const config = {name: 'RemoveBlocks', orders: {blocks: ['name', 'prefix', 'suffix']}};

    try {
      sut(schema, options, config);
    } catch (e) {
      expect(e.message).toMatch(/blocks.0.name should be a non empty string and blocks.0.prefix.+and.+suffix/);
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first and second values are objects without suffix and empty name and prefix', () => {
    const options = {
      blocks: [
        {name: '', prefix: '', any: 'any'},
        {name: '', prefix: '', any: 'any'},
      ],
    };
    const config = {name: 'RemoveBlocks', orders: {blocks: ['name', 'prefix', 'suffix']}};

    try {
      sut(schema, options, config);
    } catch (e) {
      expect(e.message).toMatch(
        /^blocks.0 should be a valid object with name, prefix, suffix and blocks.0.name.+and.+prefix.+and.+blocks.1/,
      );
    }
    expect.assertions(1);
  });
});
