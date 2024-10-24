const converter = require('./helpers/converter');
const reader = require('./helpers/reader');
const sut = require('../lib/index');

describe('test suite for the multi-line repeated case', () => {
  const input = reader('multi-line-repeated');
  const expected = `/* this comment should not be removed */
let fizzBuzz = function (n) {
  let result = '';
  for (i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      result += "FizzBuzz\\n";
    } else if (i % 3 === 0) {
      result += "Fizz\\n";
    } else if (i % 5 === 0) {
      result += "Buzz\\n";
    } else {
      result += i.toString() + "\\n";
    }
  }

  return result;
};`;

  it('can remove blocks generated from a string parameter', () => {
    const output = sut(input, {blocks: ['dev']});

    expect(converter(output)).toBe(converter(expected));
  });

  it('can remove blocks generated from an object parameter', () => {
    const options = {
      blocks: [
        {
          label: 'dev',
          start: '/*',
          end: '*/',
        },
      ],
    };

    const output = sut(input, options);

    expect(converter(output)).toBe(converter(expected));
  });
});
