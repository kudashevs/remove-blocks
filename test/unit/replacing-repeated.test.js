const {describe, it, expect} = require('@jest/globals');
const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('replace repeated multi-line blocks from code test suite', () => {
  const input = reader('multi-line-repeated');
  const expected = `/* this comment should not be removed */
let fizzBuzz = function (n) {
  let result = '';
  for (i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      /* replaced */
      result += "FizzBuzz\\n";
    } else if (i % 3 === 0) {
      /* replaced */
      result += "Fizz\\n";
    } else if (i % 5 === 0) {
      /* replaced */
      result += "Buzz\\n";
    } else {
      /* replaced */
      result += i.toString() + "\\n";
    }
  }

  return result;
};`;

  it('can replace blocks generated from an object parameter', () => {
    const options = {
      blocks: [
        {
          name: 'dev',
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
