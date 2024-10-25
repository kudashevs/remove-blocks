const sut = require('../lib/index');

describe('removing test suite', () => {
  it.each([
    ['visible /* debug:start */ will be removed /* debug:end */', 'visible '],
    ['  visible /* debug:start */ will be removed /* debug:end */', '  visible '],
    ['/* debug:start */ will be removed /* debug:end */ visible', ' visible'],
    ['/* debug:start */ will be removed /* debug:end */ visible  ', ' visible  '],
    ['visible /* debug:start */ will be removed /* debug:end */ visible', 'visible  visible'],
    ['  visible /* debug:start */ will be removed /* debug:end */  visible', '  visible   visible'],
  ])('can remove a multi-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          label: 'debug',
          start: '/*',
          end: '*/',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it.each([
    ['visible // debug:start will be removed // debug:end', 'visible '],
    ['  visible // debug:start will be removed // debug:end', '  visible '],
    ['visible // debug:start will be removed // debug:end  ', 'visible '],
    ['  visible // debug:start will be removed // debug:end  ', '  visible '],
  ])('can remove a single-line comment "%s"', (input, expected) => {
    const options = {
      blocks: [
        {
          label: 'debug',
          start: '//',
          end: '',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toBe(expected);
  });
});
