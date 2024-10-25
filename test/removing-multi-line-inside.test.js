const converter = require('./helpers/converter');
const reader = require('./helpers/reader');
const sut = require('../lib/index');

describe('removing multi-line inline test suite', () => {
  const input = reader('multi-line-inside');
  const expected = `console.log('User was created ' + user.name + ' ' +  user.age);`;

  it('can remove a multi-line comment inside string generated from a string parameter', () => {
    const output = sut(input, {blocks: ['dev']});

    expect(converter(output)).toBe(converter(expected));
  });

  it('can remove a multi-line comment inside string generated from an object parameter', () => {
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
