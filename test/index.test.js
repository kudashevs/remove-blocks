const sut = require('../lib/index');

describe('default test suite', () => {
  const originalMode = process.env.NODE_ENV;

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('proceeds in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(sut(input, {})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('skips in development environment by default', () => {
    process.env.NODE_ENV = 'development';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toBe('development');
    expect(sut(input, {})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can skip in test environment when an option provided', () => {
    process.env.NODE_ENV = 'test';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toBe('test');
    expect(sut(input, {exclude: ['test']})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can handle an empty blocks option', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {blocks: []})).toBe(expected);
  });

  it('can handle an empty object in the blocks option', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {blocks: [{}]})).toBe(expected);
  });

  it('can remove a block generated from defaults', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(sut(input, {})).toBe(expected);
  });

  it('can remove a block generated from a string parameter', () => {
    let options = {
      blocks: ['debug'],
    };

    let input = 'visible /* debug:start */ will be removed /* debug:end */';
    let expected = 'visible ';

    expect(sut(input, options)).toBe(expected);
  });

  it('can remove a block generated from an object parameter', () => {
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

  it.each([
    ['no spaces', 'visible <!--debug:start--> will be removed <!--debug:end-->', 'visible '],
    ['spaces', 'visible <!-- debug:start --> will be removed <!-- debug:end -->', 'visible '],
    ['tabulations', 'visible <!--\tdebug:start\t--> will be removed <!--\tdebug:end\t-->', 'visible '],
  ])('can use %s between start/end and a label', (_, input, expected) => {
    let options = {
      blocks: [
        {
          label: 'debug',
          start: '<!--',
          end: '-->',
        },
      ],
    };

    expect(sut(input, options)).toBe(expected);
  });

  it('can use multiple characters between start/end and a label', () => {
    let options = {
      blocks: [
        {
          label: 'debug',
          start: '<!--',
          end: '-->',
        },
      ],
    };
    let input = 'visible <!--   debug:start   --> will be removed <!--\t \tdebug:end\t \t-->';
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

  it('can remove a block marked in lower case', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(sut(input, {})).toBe(expected);
  });

  it('cannot remove a block marked in upper case with default settings', () => {
    let input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    let expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    expect(sut(input, {})).toBe(expected);
  });

  it('can remove a block marked in upper case with provided settings', () => {
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
