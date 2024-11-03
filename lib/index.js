'use strict';

const validate = require('./validator');
const schema = require('./options.json');
const config = require('./config.json');
const {EOL} = require('os');

const EXCLUDE_ENVS = ['development'];
const TAG_PREFIX = '/*';
const TAG_SUFFIX = '*/';

/**
 * @param {string} content
 * @param {Object} options
 * @param {Array<string>} [options.skips]
 * @param {Array<string|{name: string, prefix: string, suffix: string}>} [options.blocks]
 *
 * @return {string}
 */
function RemoveBlocks(content, options = {}) {
  if (shouldSkipProcessing(options)) {
    return content;
  }

  validate(schema, options, config);

  return removeBlocksFrom(content, options.blocks ?? []);
}

/**
 * @param {Object} options
 * @param {Array<string>} [options.skips]
 * @param {Array<string|{name: string, prefix: string, suffix: string}>} [options.blocks]
 *
 * @return {boolean}
 */
function shouldSkipProcessing(options) {
  if (shouldSkipEnvironment(options.skips)) {
    return true;
  }

  return false;
}

/**
 * @param {Array<string>} skips
 *
 * @returns {boolean}
 */
function shouldSkipEnvironment(skips = []) {
  const excluded = [...EXCLUDE_ENVS, ...skips];
  const env = process.env.NODE_ENV ?? '';

  return excluded.includes(env);
}

function removeBlocksFrom(content, blocks) {
  blocks.forEach(function (block) {
    const {start, end, prefix, suffix} = prepareBlock(block);

    const regex = new RegExp(
      // prettier-ignore
      '(\\n?)([\\t ]*)' + prefix + '[\\t ]* ?' + start + '[\\t ]* ?' + suffix + '([\\s\\S]*?)?' + prefix + '[\\t ]* ?' + end + '[\\t ]* ?' + suffix + '([\\t ]*)(\\n?)',
      'g',
    );

    content = content.replaceAll(regex, (substring, preline, prespace, marked, postspace, endline) => {
      const found = {preline, prespace, marked, postspace, endline};

      return prepareReplacement(block, found);
    });
  });

  return content;
}

/**
 * @param {string|{name: string, prefix: string, suffix: string}} blockFromOptions
 *
 * return {{start: string, end: string, prefix: string, suffix: string}}
 */
function prepareBlock(blockFromOptions) {
  let block = {};

  if (typeof blockFromOptions === 'string') {
    block = generateBlockFromString(blockFromOptions);
  }

  if (typeof blockFromOptions === 'object') {
    block = generateBlockFromObject(blockFromOptions);
  }

  return escapeBlockElements(block);
}

/**
 * note: default empty name guarantees that it won't remove anything even if the argument is wrong.
 *
 * @param {string} name
 *
 * @return {{start: string, end: string, prefix: string, suffix: string}}
 */
function generateBlockFromString(name = '') {
  return {
    start: `${name}:start`,
    end: `${name}:end`,
    prefix: TAG_PREFIX,
    suffix: TAG_SUFFIX,
  };
}

/**
 * @param {{name: string, prefix: string, suffix: string}} block
 *
 * return {{start: string, end: string, prefix: string, suffix: string}}
 */
function generateBlockFromObject(block) {
  const defaults = generateBlockFromString(block.name);

  return {...defaults, ...block};
}

/**
 * @param {{start: string, end: string, prefix: string, suffix: string}} block
 *
 * return {{start: string, end: string, prefix: string, suffix: string}}
 */
function escapeBlockElements(block) {
  return {
    start: regexEscape(block.start),
    end: regexEscape(block.end),
    prefix: regexEscape(block.prefix),
    suffix: regexEscape(block.suffix),
  };
}

/**
 * @param {string} str
 */
function regexEscape(str) {
  return str.replace(/([\^$.*+?=!:\\\/()\[\]{}])/gi, '\\$1');
}

/**
 * @param {Object} block
 * @param {Object} found
 *
 * @returns {string}
 */
function prepareReplacement(block, found) {
  if (isMultiLine(found.marked)) {
    return prepareMultiLineReplacement(block, found);
  }

  return prepareSingleLineReplacement(block, found);
}

/**
 * @param {string} str
 *
 * @returns {boolean}
 */
function isMultiLine(str) {
  return /[\r\n]/.test(str);
}

/**
 * @param {Object} block
 * @param {Object} found
 *
 * @returns {string}
 */
function prepareMultiLineReplacement(block, found) {
  return found.preline + '';
}

/**
 * @param {Object} block
 * @param {Object} found
 *
 * @returns {string}
 */
function prepareSingleLineReplacement(block, found) {
  if (isWholeLine(found)) {
    return EOL;
  }

  return found.prespace + '' + found.postspace + found.endline;
}

/**
 * @param {Object} found
 *
 * @returns {boolean}
 */
function isWholeLine(found) {
  return found.preline.length && found.endline.length;
}

module.exports = RemoveBlocks;
