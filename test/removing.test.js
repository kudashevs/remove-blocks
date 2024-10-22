const converter = require('./helpers/converter');
const reader = require('./helpers/reader');
const sut = require('../lib/index');

describe('removing test suite', () => {

  it.each([
    ['visible /* debug:start */ will be removed /* debug:end */', 'visible '],
    ['  visible /* debug:start */ will be removed /* debug:end */', '  visible '],
    ['/* debug:start */ will be removed /* debug:end */ visible', ' visible'],
    ['/* debug:start */ will be removed /* debug:end */ visible  ', ' visible  '],
    ['visible /* debug:start */ will be removed /* debug:end */ visible', 'visible  visible'],
    ['  visible /* debug:start */ will be removed /* debug:end */  visible', '  visible   visible'],
  ])('can apply in single-line "%s" with keepspace set to true', (input, expected) => {
    let options = {
      blocks: [
        {
          label: 'debug',
          start: '/*',
          end: '*/',
        },
      ],
    };

    expect(sut(input, options)).toBe(expected);
  });

  it('can apply a multi-line replacement from a string parameter', async () => {
    const EXPECTED_OUTPUT = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

    const input = reader('multi-line-basic');

    expect(sut(input, {blocks: ['debug']})).toBe(converter(EXPECTED_OUTPUT));
  });

  it('can apply a multi-line replacement with an object parameter and keepspace set to true', async () => {
    const EXPECTED_OUTPUT = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

    let options = {
      blocks: [
        {
          label: 'debug',
          start: '/*',
          end: '*/',
          keepspace: true,
        },
      ],
    };

    const input = reader('multi-line-basic');

    expect(sut(input, options)).toBe(converter(EXPECTED_OUTPUT));
  });
});
