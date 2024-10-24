const converter = require('./helpers/converter');
const reader = require('./helpers/reader');
const sut = require('../lib/index');

describe('removing single-line block test suite', () => {
  const input = reader('single-line-block');
  const expected = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

  it('can remove a single-line comment generated from an object parameter', () => {
    let options = {
      blocks: [
        {
          label: 'debug',
          start: '//',
          end: '',
          keepspace: true,
        },
      ],
    };

    const output = sut(input, options);

    expect(converter(output)).toBe(converter(expected));
  });
});
