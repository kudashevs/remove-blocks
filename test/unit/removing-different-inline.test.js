const {describe, it, expect} = require('@jest/globals');
const sut = require('../../lib/index');

describe('remove multi-line block from a line test suite', () => {
  it.each([
    ['visible /* debug:start */ will be removed /* debug:end */', 'visible '],
    ['  visible /* debug:start */ will be removed /* debug:end */', '  visible '],
    ['/* debug:start */ will be removed /* debug:end */ visible', ' visible'],
    ['/* debug:start */ will be removed /* debug:end */ visible  ', ' visible  '],
    ['visible /* debug:start */ will be removed /* debug:end */ visible', 'visible  visible'],
    ['  visible /* debug:start */ will be removed /* debug:end */  visible', '  visible   visible'],
  ])('can remove a multi-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toBe(expected);
  });
});

describe('remove single-line block from a line test suite', () => {
  it.each([
    ['visible // debug:start will be removed // debug:end', 'visible '],
    ['  visible // debug:start will be removed // debug:end', '  visible '],
    ['visible // debug:start will be removed // debug:end  ', 'visible '],
    ['  visible // debug:start will be removed // debug:end  ', '  visible '],
  ])('can remove a single-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '//',
          suffix: '',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toBe(expected);
  });
});
