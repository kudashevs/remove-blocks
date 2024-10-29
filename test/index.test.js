const sut = require('../lib/index');

describe('default test suite', () => {
  const originalMode = process.env.NODE_ENV;
  const defaultOptions = {blocks: ['devblock']};

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('proceeds in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(sut(input, defaultOptions)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('skips in development environment by default', () => {
    process.env.NODE_ENV = 'development';

    const input = '/* devblock:start */ visible /* devblock:end */';
    const expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toBe('development');
    expect(sut(input, defaultOptions)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can skip in test environment when an option provided', () => {
    process.env.NODE_ENV = 'test';

    const input = '/* devblock:start */ visible /* devblock:end */';
    const expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toBe('test');
    expect(sut(input, {skips: ['test']})).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can handle an empty blocks option', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {blocks: []})).toBe(expected);
  });

  it('can handle an empty object in the blocks option', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {blocks: [{}]})).toBe(expected);
  });

  it('can remove a block generated from defaults', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    const output = sut(input, {});

    expect(output).toBe(expected);
  });

  it('can remove a block generated from a string parameter', () => {
    const options = {blocks: ['debug']};
    const input = 'visible /* debug:start */ will be removed /* debug:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it('can remove a block generated from an object parameter', () => {
    const options = {
      blocks: [
        {
          label: 'debug',
          start: '/*',
          end: '*/',
        },
      ],
    };
    const input = 'visible /* debug:start */ will be removed /* debug:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it.each([
    ['no spaces', 'visible <!--debug:start--> will be removed <!--debug:end-->', 'visible '],
    ['spaces', 'visible <!-- debug:start --> will be removed <!-- debug:end -->', 'visible '],
    ['tabulations', 'visible <!--\tdebug:start\t--> will be removed <!--\tdebug:end\t-->', 'visible '],
  ])('can use %s between start/end and a label', (_, input, expected) => {
    const options = {
      blocks: [
        {
          label: 'debug',
          start: '<!--',
          end: '-->',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it('can use multiple characters between start/end and a label', () => {
    const options = {
      blocks: [
        {
          label: 'debug',
          start: '<!--',
          end: '-->',
        },
      ],
    };
    const input = 'visible <!--   debug:start   --> will be removed <!--\t \tdebug:end\t \t-->';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it('can use special characters in labels', () => {
    const options = {
      blocks: [
        {
          label: '*devblock!',
          start: '<!--',
          end: '-->',
        },
      ],
    };
    const input = 'visible <!-- *devblock!:start --> will be removed <!-- *devblock!:end -->';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toBe(expected);
  });

  it('can remove a block marked in lower case', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    const output = sut(input, defaultOptions);

    expect(output).toBe(expected);
  });

  it('cannot remove a block marked in upper case with default settings', () => {
    const input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    const expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    const output = sut(input, defaultOptions);

    expect(output).toBe(expected);
  });

  it('can remove a block marked in upper case with the specific settings', () => {
    const options = {
      blocks: [
        {
          label: 'DEVBLOCK',
          start: '/*',
          end: '*/',
        },
      ],
    };
    const input = 'visible /* DEVBLOCK:start */ will be removed /* DEVBLOCK:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toBe(expected);
  });
});
