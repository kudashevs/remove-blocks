/* eslint-env node */
'use strict';

const EXCLUDE_ENVS = ['development'];
const DEFAULT_LABEL = 'devblock';
const COMMENT_START = '/*';
const COMMENT_END = '*/';

const defaultOptions = {
  blocks: [generateOptionsFromString(DEFAULT_LABEL)],
};

/**
 * @param {string} label
 *
 * @return {Object}
 */
function generateOptionsFromString(label) {
  return {
    open: `${label}:start`,
    close: `${label}:end`,
    start: COMMENT_START,
    end: COMMENT_END,
  };
}

/**
 * @param {{open: string, close: string, start: string, end: string}} block
 *
 * return {Object}
 */
function generateOptionsFromObject(block) {
  const defaults = generateOptionsFromString(block.label || DEFAULT_LABEL);
  const generated = {...defaults, ...block};

  return generated;
}

function prepareOptions(block) {
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
 * @param {array} options.exclude
 * @param {array} options.blocks
 *
 * @return {string}
 */
function RemoveCodeBlocks(content, options = {}) {
  if (shouldSkip(process.env.NODE_ENV, options.exclude)) {
    return content;
  }

  if (isEmpty(options)) {
    options = defaultOptions;
  }

  options.blocks.forEach(function (block) {
    if (typeof block === 'string') {
      block = generateOptionsFromString(block);
    }

    if (typeof block === 'object') {
      block = generateOptionsFromObject(block)
    }

    const {open, close, start, end} = prepareOptions(block);

    // prettier-ignore
    let regex = new RegExp(
      '(\\n?)([\\t ]*)' + start + '[\\t ]* ?' + open + '[\\t ]* ?' + end + '([\\s\\S]*?)?' + start + '[\\t ]* ?' + close + '[\\t ]* ?' + end + '([\\t ]*)(\\n?)',
      'g'
    );

    content = content.replaceAll(regex, (substring, preline, prespace, marked, postspace, endline) => {
      let found = {preline, prespace, marked, postspace, endline};

      return prepareWithoutReplacement(block, found);
    });
  });

  return content;
}

/**
 *
 * @param {string} env
 * @param {array} exclude
 *
 * @return {boolean}
 */
function shouldSkip(env, exclude = []) {
  const excluded = [...EXCLUDE_ENVS, ...exclude];

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
function prepareWithoutReplacement(block, found) {
  if (isMultiLine(found.marked)) {
    return prepareMultiLineWithoutReplacement(block, found);
  }

  return prepareSingleLineWithoutReplacement(block, found);
}

/**
 * @param {string} str
 *
 * @returns {boolean}
 */
function isMultiLine(str) {
  return /\r|\n/.test(str);
}

function prepareMultiLineWithoutReplacement(block, found) {
  return found.preline + '';
}

function prepareSingleLineWithoutReplacement(block, found) {
  return found.prespace + '' + found.postspace;
}

module.exports = RemoveCodeBlocks;
