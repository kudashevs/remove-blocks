/* eslint-env node */
'use strict';

const Ajv = require('ajv').default;
const ajv = new Ajv({allErrors: true, strict: false, verbose: false});
require('ajv-errors')(ajv /*, {singleError: true} */);

function validate(schema, options, configuration = {}) {
  const validator = ajv.compile(schema);
  const validation = validator(options);

  if (!validation) {
    const errors = validator.errors || [];
    const message = formatValidationErrors(errors, configuration);

    throw new Error(message);
  }
}

function formatValidationErrors(errors) {
  return (result = errors
    .filter(filterValidationErrors)
    .sort(error => error.instancePath.length)
    .reverse()
    .map(error => {
      return error.message;
    })
    .join(' and '));
}

function filterValidationErrors(error) {
  return error.keyword !== 'oneOf' && error.keyword !== 'if' && error.keyword !== 'then' && error.keyword !== 'else';
}

module.exports = validate;
