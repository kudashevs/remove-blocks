const sut = require('../lib/validator');
const schema = require('../lib/options.json');

describe('options test suite', () => {
  it('passes when options value is an empty object', () => {
    expect(() => sut(schema, {})).not.toThrow(Error);
  });

  it('fails when options value is not an object', () => {
    const options = [];

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('must be an object');
    }
    expect.assertions(1);
  });

  it('fails when options.skips value is not an array', () => {
    const options = {skips: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('skips option must be an array');
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
      expect(e.message).toBe(expected);
    }
    expect.assertions(1);
  });

  it('fails when options.blocks value is not an array', () => {
    const options = {blocks: 'wrong'};

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toBe('blocks option must be an array');
    }
    expect.assertions(1);
  });

  it.each([
    ['first value is not a string neither an object', {blocks: [42]}, 'blocks.0 should be a string or a valid object'],
    ['first value is an empty string', {blocks: ['']}, 'blocks.0 should be a non empty string'],
    ['first value is an empty object', {blocks: [{}]}, 'blocks.0 should be an object (with label, start, end)'],
    [
      'first value is an object without label',
      {
        blocks: [{start: 'any', stop: 'any'}],
      },
      /^blocks.0 should be an object/,
    ],
    [
      'first value is an object with empty label',
      {
        blocks: [{label: '', start: 'any', stop: 'any'}],
      },
      'label should be a non empty string',
    ],
    [
      'first value is an object with empty start',
      {
        blocks: [{label: 'any', start: '', stop: 'any'}],
      },
      'start should be a non empty string',
    ],
    [
      'second value is an empty string',
      {
        blocks: [{label: 'any', start: 'any', end: 'any'}, ''],
      },
      'blocks.1 should be a non empty string',
    ],
    [
      'second value is an empty object',
      {
        blocks: [{label: 'any', start: 'any', end: 'any'}, {}],
      },
      'blocks.1 should be an object (with label, start, end)',
    ],
    [
      'second value is an object without label',
      {
        blocks: [
          {label: 'any', start: 'any', end: 'any'},
          {start: 'any', stop: 'any'},
        ],
      },
      /^blocks.1 should be an object/,
    ],
  ])('fails when in options.blocks the %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(expected);
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first value is an object without end and empty label and start', () => {
    const options = {
      blocks: [{label: '', start: '', any: 'any'}],
    };

    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toMatch(/^blocks.0 should be an object \(with label, start, end\) and.+label.+and.+start/);
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first value is an object that breaks all of the rules', () => {
    const options = {
      blocks: [{label: '', start: '', end: 42}],
    };
    const configuration = {name: 'RemoveBlocks', order: {blocks: ['label', 'start', 'end']}};

    try {
      sut(schema, options, configuration);
    } catch (e) {
      expect(e.message).toMatch(/label should be a non empty string and.+start.+and.+end/);
    }
    expect.assertions(1);
  });

  it('fails with a combined error when in options.blocks the first and second values are an object without end and empty label and start', () => {
    const options = {
      blocks: [
        {label: '', start: '', any: 'any'},
        {label: '', start: '', any: 'any'},
      ],
    };
    const configuration = {name: 'RemoveBlocks', order: {blocks: ['label', 'start', 'end']}};

    try {
      sut(schema, options, configuration);
    } catch (e) {
      // expect(e.message).toMatch('label should be a non empty string');
      expect(e.message).toMatch(/^blocks.0 should be an object \(with label, start, end\) and.+start.+and.+label/);
    }
    expect.assertions(1);
  });
});
