const {describe, it, expect} = require('@jest/globals');
const sut = require('../../lib/index');
const schema = require('../../lib/options.json');
const config = require('../../lib/config.json');

describe('specification test', () => {
  it('should validate and fail on a skips option with a wrong value', () => {
    const options = {skips: [42]};

    try {
      sut(schema, options, config);
    } catch (e) {
      expect(e.message).toMatch(/^skips.0 should be a string/);
    }
    expect.assertions(1);
  });

  it('should validate and fail on a blocks option with a wrong value', () => {
    const options = {blocks: [42]};

    try {
      sut(schema, options, config);
    } catch (e) {
      expect(e.message).toMatch(/^blocks.0 should be a string or.+object/);
    }
    expect.assertions(1);
  });

  it('should validate, fail on a wrong blocks option, and keep the default order from config', () => {
    const options = {
      blocks: [{name: '', prefix: '', suffix: 42}],
    };

    try {
      sut(schema, options, config);
    } catch (e) {
      expect(e.message).toMatch(/name should be a non empty string and prefix.+and.+suffix/);
    }
    expect.assertions(1);
  });

  it('should remove a multi-line block marked with the provided options', () => {
    const options = {blocks: [{name: 'dev', prefix: '<!--', suffix: '-->'}]};
    const input = `test
    <!-- dev:start -->
    console.log('log an operation');
    <!-- dev:end -->`;
    const expected = 'test\n';

    expect(sut(input, options)).toStrictEqual(expected);
  });

  it('should remove a single-line block marked with the provided options', () => {
    const options = {blocks: [{name: 'dev', prefix: '//', suffix: ''}]};
    const input = `test
    // dev:start
    console.log('log an operation');
    // dev:end`;
    const expected = 'test\n';

    expect(sut(input, options)).toStrictEqual(expected);
  });

  it('should remove an inlined multi-line block with the provided options', () => {
    const options = {blocks: [{name: 'dev', prefix: '<!--', suffix: '-->'}]};
    const input = `test<!-- dev:start -->console.log('log an operation')<!-- dev:end -->`;
    const expected = 'test';

    expect(sut(input, options)).toStrictEqual(expected);
  });

  it('should remove repeated blocks with the provided options', () => {
    const options = {blocks: [{name: 'dev', prefix: '<!--', suffix: '-->'}]};
    const input = `<!-- dev:start -->console.log('log an operation')<!-- dev:end -->test<!-- dev:start -->console.log('log an operation')<!-- dev:end -->`;
    const expected = 'test';

    expect(sut(input, options)).toStrictEqual(expected);
  });

  it('should remove multiple blocks with the provided options', () => {
    const options = {blocks: ['dev', {name: 'dev', prefix: '<!--', suffix: '-->'}]};
    const input = `<!-- dev:start -->console.log('log an operation')<!-- dev:end -->test<!-- dev:start -->console.log('log an operation')<!-- dev:end -->
    /* dev:start */
    console.log('log an operation');
    /* dev:end */`;
    const expected = 'test\n';

    expect(sut(input, options)).toStrictEqual(expected);
  });
});
