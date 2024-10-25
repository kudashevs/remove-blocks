/* eslint-env node */
'use strict';

const {EOL} = require('os');

const EXCLUDE_ENVS = ['development'];
const DEFAULT_LABEL = 'devblock';
const BLOCK_START = '/*';
const BLOCK_END = '*/';

const defaultBlock = {
  ...generateBlockFromString(DEFAULT_LABEL),
};

/**
 * note: default empty label guarantees that it won't remove anything even if the argument is wrong.
 *
 * @param {string} label
 *
 * @return {{open: string, close: string, start: string, end: string}}
 */
function generateBlockFromString(label = '') {
  return {
    open: `${label}:start`,
    close: `${label}:end`,
    start: BLOCK_START,
    end: BLOCK_END,
  };
}

/**
 * @param {{label: string, start: string, end: string}} block
 *
 * return {{open: string, close: string, start: string, end: string}}
 */
function generateBlockFromObject(block) {
  const defaults = generateBlockFromString(block.label);

  return {...defaults, ...block};
}

/**
 * note: default empty values guarantee that it won't remove anything even if a block object is wrong.
 *
 * @param {{open: string, close: string, start: string, end: string}} block
 *
 * return {{open: string, close: string, start: string, end: string}}
 */
function prepareBlockElements(block) {
  return {
    open: block.open ? regexEscape(block.open) : '',
    close: block.close ? regexEscape(block.close) : '',
    start: block.start ? regexEscape(block.start) : '',
    end: block.end ? regexEscape(block.end) : '',
  };
}

/**
 * @param {string} content
 * @param {Object} options
 * @param {array=} options.exclude
 * @param {array=} options.blocks
 *
 * @return {string}
 */
function RemoveBlocks(content, options = {}) {
  if (shouldSkip(process.env.NODE_ENV, options.skips)) {
    return content;
  }

  options.blocks = options.blocks || [defaultBlock];

  options.blocks.forEach(function (block) {
    if (typeof block === 'string') {
      block = generateBlockFromString(block);
    }

    if (typeof block === 'object') {
      block = generateBlockFromObject(block);
    }

    const {open, close, start, end} = prepareBlockElements(block);

    const regex = new RegExp(
      // prettier-ignore
      '(\\n?)([\\t ]*)' + start + '[\\t ]* ?' + open + '[\\t ]* ?' + end + '([\\s\\S]*?)?' + start + '[\\t ]* ?' + close + '[\\t ]* ?' + end + '([\\t ]*)(\\n?)',
      'g'
    );

    content = content.replaceAll(regex, (substring, preline, prespace, marked, postspace, endline) => {
      const found = {preline, prespace, marked, postspace, endline};

      return prepareReplacement(block, found);
    });
  });

  return content;
}

/**
 *
 * @param {string} env
 * @param {array} skips
 *
 * @return {boolean}
 */
function shouldSkip(env, skips = []) {
  const excluded = [...EXCLUDE_ENVS, ...skips];

  return excluded.includes(env);
}

/**
 * @param {string} str
 */
function regexEscape(str) {
  return str.replace(/([\^$.*+?=!:\\\/()\[\]{}])/gi, '\\$1');
}

/**
 * @param {Object} block
 *
 * @returns {boolean}
 */

/**
 * @param {Object} found
 *
 * @returns {boolean}
 */
function isWholeLine(found) {
  return found.preline.length && found.endline.length;
}

/**
 * @param {string} str
 *
 * @returns {boolean}
 */
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
  return /\r|\n$/.test(str);
}

function prepareMultiLineReplacement(block, found) {
  return found.preline + '';
}

function prepareSingleLineReplacement(block, found) {
  if (isWholeLine(found)) {
    return EOL;
  }

  return found.prespace + '' + found.postspace;
}

module.exports = RemoveBlocks;
