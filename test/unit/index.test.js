const {describe, it, expect} = require('@jest/globals');
const sut = require('../../lib/index');
const schema = require('../../lib/options.json');

describe('default test suite', () => {
  const originalMode = process.env.NODE_ENV;
  const defaultOptions = {blocks: ['devblock']};

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('proceeds in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toStrictEqual(environment);
    expect(sut(input, defaultOptions)).toStrictEqual(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('skips in development environment by default', () => {
    process.env.NODE_ENV = 'development';

    const input = '/* devblock:start */ visible /* devblock:end */';
    const expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toStrictEqual('development');
    expect(sut(input, defaultOptions)).toStrictEqual(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can skip in test environment when an option provided', () => {
    process.env.NODE_ENV = 'test';

    const input = '/* devblock:start */ visible /* devblock:end */';
    const expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toStrictEqual('test');
    expect(sut(input, {skips: ['test']})).toStrictEqual(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can handle an empty skips option', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {skips: []})).toStrictEqual(expected);
  });

  it.each([
    ['is of a wrong type', {skips: 'wrong'}, 'skips option must be an array'],
    ['has a wrong value', {skips: [42]}, 'skips.0 should be a string'],
  ])('can validate skips option when it %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual(expected);
    }
    expect.assertions(1);
  });

  it('can handle an empty blocks option', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible /* devblock:start */ will be removed /* devblock:end */';

    expect(sut(input, {blocks: []})).toStrictEqual(expected);
  });

  it.each([
    ['is of a wrong type', {blocks: 'wrong'}, 'blocks option must be an array'],
    ['has a wrong value', {blocks: [42]}, 'blocks.0 should be a string or a valid object'],
  ])('can validate blocks option when it %s', (_, options, expected) => {
    try {
      sut(schema, options);
    } catch (e) {
      expect(e.message).toStrictEqual(expected);
    }
    expect.assertions(1);
  });

  it('can remove a block generated from a string parameter', () => {
    const options = {blocks: ['debug']};
    const input = 'visible /* debug:start */ will be removed /* debug:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it('can remove a block generated from an object parameter', () => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    };
    const input = 'visible /* debug:start */ will be removed /* debug:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it.each([
    ['no spaces', 'visible <!--debug:start--> will be removed <!--debug:end-->', 'visible '],
    ['spaces', 'visible <!-- debug:start --> will be removed <!-- debug:end -->', 'visible '],
    ['tabulations', 'visible <!--\tdebug:start\t--> will be removed <!--\tdebug:end\t-->', 'visible '],
  ])('can use %s between start/end and a name', (_, input, expected) => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    };

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it('can use multiple characters between start/end and a name', () => {
    const options = {
      blocks: [
        {
          name: 'debug',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    };
    const input = 'visible <!--   debug:start   --> will be removed <!--\t \tdebug:end\t \t-->';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it('can use special characters in names from a string', () => {
    const options = {
      blocks: ['*devblock!'],
    };
    const input = 'visible /* *devblock!:start */ will be removed /* *devblock!:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it('can use special characters in names from an object', () => {
    const options = {
      blocks: [
        {
          name: '*devblock!',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    };
    const input = 'visible <!-- *devblock!:start --> will be removed <!-- *devblock!:end -->';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });

  it('can remove a block marked in lower case', () => {
    const input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    const expected = 'visible ';

    const output = sut(input, defaultOptions);

    expect(output).toStrictEqual(expected);
  });

  it('cannot remove a block marked in upper case with default options', () => {
    const input = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";
    const expected = "visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */";

    const output = sut(input, defaultOptions);

    expect(output).toStrictEqual(expected);
  });

  it('can remove a block marked in upper case with the specific options', () => {
    const options = {
      blocks: [
        {
          name: 'DEVBLOCK',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    };
    const input = 'visible /* DEVBLOCK:start */ will be removed /* DEVBLOCK:end */';
    const expected = 'visible ';

    const output = sut(input, options);

    expect(output).toStrictEqual(expected);
  });
});
