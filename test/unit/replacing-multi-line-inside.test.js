const {describe, it, expect} = require('@jest/globals');
const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('remove multi-line inlined block from inside code test suite', () => {
  const input = reader('multi-line-inside');
  const expected = `console.log('User was created ' + user.name + ' ' + /* replaced */ user.age);`;

  it('can remove a multi-line comment inside string generated from an object parameter', () => {
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
