const {describe, it, expect} = require('@jest/globals');
const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('replace multi-line block from code test suite', () => {
  const input = reader('multi-line-block');
  const expected = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    /* replaced */
    return num + one;
}`;

  it('can replace a multi-line comment generated from an object parameter', () => {
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

    expect(converter(output)).toStrictEqual(converter(expected));
  });
});
