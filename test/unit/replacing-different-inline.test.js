const {describe, it, expect} = require('@jest/globals');
const sut = require('../../lib/index');

describe('replace multi-line block from a line test suite', () => {
  it.each([
    ['visible /* debug:start */ will be replaced /* debug:end */', 'visible /* replaced */'],
    ['  visible /* debug:start */ will be replaced /* debug:end */', '  visible /* replaced */'],
    ['/* debug:start */ will be replaced /* debug:end */ visible', '/* replaced */ visible'],
    ['/* debug:start */ will be replaced /* debug:end */ visible  ', '/* replaced */ visible  '],
    ['visible /* debug:start */ will be replaced /* debug:end */ visible', 'visible /* replaced */ visible'],
    ['  visible /* debug:start */ will be replaced /* debug:end */  visible', '  visible /* replaced */  visible'],
  ])('can replace a multi-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '/*',
          suffix: '*/',
          replacement: '/* replaced */',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });
});

describe('replace single-line block from a line test suite', () => {
  it.each([
    ['visible // debug:start will be replaced // debug:end', 'visible // replaced'],
    ['  visible // debug:start will be replaced // debug:end', '  visible // replaced'],
    ['visible // debug:start will be replaced // debug:end  ', 'visible // replaced'],
    ['  visible // debug:start will be replaced // debug:end  ', '  visible // replaced'],
  ])('can replace a single-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '//',
          suffix: '',
          replacement: '// replaced',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });
});
