const {describe, it, expect} = require('@jest/globals');
const converter = require('../helpers/converter');
const reader = require('../helpers/reader');
const sut = require('../../lib/index');

describe('remove multi-line inlined block from inside code test suite', () => {
  const input = reader('multi-line-inside');
  const expected = `console.log('User was created ' + user.name + ' ' +  user.age);`;

  it('can remove a multi-line comment inside string generated from a string parameter', () => {
    const output = sut(input, {blocks: ['dev']});

    expect(converter(output)).toStrictEqual(converter(expected));
  });

  it('can remove a multi-line comment inside string generated from an object parameter', () => {
    const options = {
      blocks: [
        {
          name: 'dev',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    };

    const output = sut(input, options);

    expect(converter(output)).toStrictEqual(converter(expected));
  });
});
