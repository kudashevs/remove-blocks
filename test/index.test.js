const sut = require('../lib/index');

describe('default test suite', () => {
  const originalMode = process.env.NODE_ENV;

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('can proceed in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(sut(input, {})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it.each([
    ['development', '/* devblock:start */ any /* devblock:end */', '/* devblock:start */ any /* devblock:end */'],
  ])('can skip in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(sut(input, {})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can remove a code block marked with defaults', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(sut(input, {})).toBe(expected);
  });

  it('can remove a code block from a string parameter', () => {
    let options = {
      blocks: [
        'debug'
      ],
    }

    let input = 'visible /* debug:start */ will be removed /* debug:end */';
    let expected = 'visible ';

    expect(sut(input, options)).toBe(expected);
  });

  it('can remove a code block from an object parameter', () => {
    let options = {
      blocks: [
        {
          label: 'debug',
          start: '/*',
          end: '*/',
        },
      ],
    };
    let input = 'visible /* debug:start */ will be removed /* debug:end */';
    let expected = 'visible ';

    expect(sut(input, options)).toBe(expected);
  });

  it('can use special characters in labels', () => {
    let options = {
      blocks: [
        {
          label: '*devblock!',
          start: '<!--',
          end: '-->',
        },
      ],
    };
    let input = 'visible <!-- *devblock!:start --> will be removed <!-- *devblock!:end -->';
    let expected = 'visible ';

    expect(sut(input, options)).toBe(expected);
  });

  it('can remove a code block marked in lower case', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(sut(input, {})).toBe(expected);
  });

  it('cannot remove a code block marked in upper case with default settings', () => {
    let input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    let expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    expect(sut(input, {})).toBe(expected);
  });

  it('can remove a code block marked in upper case with provided settings', () => {
    let options = {
      blocks: [
        {
          label: 'DEVBLOCK',
          start: '/*',
          end: '*/',
        },
      ],
    };

    let input = "visible /* DEVBLOCK:start */ won't be removed /* DEVBLOCK:end */";
    let expected = 'visible ';

    expect(sut(input, options)).toBe(expected);
  });
});
