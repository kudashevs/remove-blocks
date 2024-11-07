const {describe, it, expect} = require('@jest/globals');
const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('remove multi-line block from code test suite', () => {
  const input = reader('multi-line-block');
  const expected = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

  it('can remove a multi-line comment generated from a string parameter', () => {
    const output = sut(input, {blocks: ['debug']});

    expect(converter(output)).toBe(converter(expected));
  });

  it('can remove a multi-line comment generated from an object parameter', () => {
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

    expect(converter(output)).toBe(converter(expected));
  });
});
