'use strict';

const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('remove single-line block from code test suite', () => {
  const input = reader('single-line-block');
  const expected = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

  it('can remove a single-line comment generated from an object parameter', () => {
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

    expect(converter(output)).toBe(converter(expected));
  });
});
