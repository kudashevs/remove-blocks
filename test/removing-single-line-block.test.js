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

  it('can apply a multi-line replacement with an object parameter and keepspace set to true', () => {
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

    expect(sut(input, options)).toBe(converter(expected));
  });
});
