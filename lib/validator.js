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

function formatValidationErrors(errors, configuration) {
  // prettier-ignore
  const errorsWithPriority = errors
    .filter(isVisibleValidationError)
    .map(addPriorities(configuration));

  return errorsWithPriority
    .sort(sortByPriorities)
    .map(err => err.message)
    .join(' and ');

  return result;
}

function isVisibleValidationError(err) {
  // prettier-ignore
  return err.keyword !== 'oneOf'
    && err.keyword !== 'if'
    && err.keyword !== 'then'
    && err.keyword !== 'else';
}

function addPriorities(configuration) {
  return function (err) {
    // prettier-ignore
    const [
      section,
      position = 99,
      name = '',
    ] = err.instancePath.replace(/^\//, '').split('/');
    const order = configuration?.orders?.[section] || [];

    err.priorityByIndex = position;
    err.priorityByName = retrieveOrder(name, order);

    return err;
  };
}

function retrieveOrder(name, order) {
  order = order || [];
  for (let i = 0; i < order.length; i++) {
    if (name.includes(order[i])) {
      return i;
    }
  }

  return -1;
}

function sortByPriorities(a, b) {
  // prettier-ignore
  return a.priorityByIndex - b.priorityByIndex
    || a.priorityByName - b.priorityByName
    || a.instancePath.localeCompare(b.instancePath);
}

module.exports = validate;
