const sut = require('../lib/validator');
const schema = require('../lib/options.json');

describe('options test suite', () => {
  it('can skip the empty options object', () => {
    expect(() => sut(schema, {})).not.toThrow(Error);
  });

  it('fails when the options value is not an object', () => {
    const options = [];

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('must be an object');
    }
    expect.assertions(1);
  });

  it('fails when the skips option is not an array', () => {
    const options = {skips: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('skips option must be an array');
    }
    expect.assertions(1);
  });

  it.each([
    ['is not a string', {skips: [42]}, 'an environment should be a string'],
    ['is an empty string', {skips: ['']}, 'an environment should be a non empty string'],
  ])('fails when the skips option value %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe(expected);
    }
    expect.assertions(1);
  });

  it('fails when the blocks option is not an array', () => {
    const options = {blocks: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('blocks option must be an array');
    }
    expect.assertions(1);
  });

  it.each([
    ['is not a string neither an object', {blocks: [42]}, /^a block should be a string or/],
    ['is an empty string', {blocks: ['']}, 'a block should be a non empty string'],
    ['is an empty object', {blocks: [{}]}, 'a block should be an object with label, start, and end properties'],
    ['is an object without label', {blocks: [{start: 'any', stop: 'any'}]}, /^a block should be/],
    [
      'is an object with empty label',
      {blocks: [{label: '', start: 'any', stop: 'any'}]},
      'a label should be a non empty string',
    ],
    [
      'is an object with empty start',
      {blocks: [{label: 'any', start: '', stop: 'any'}]},
      'a start should be a non empty string',
    ],
  ])('fails when the blocks option value %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(expected);
    }
    expect.assertions(1);
  });
});
