/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  isPresent,
  isEmpty,
  typeOf
} = Ember;
const { keys } = Object;

function _isNumber(value) {
  return typeOf(value) === 'number' && !isNaN(value);
}

function _isInteger(value) {
  return typeOf(value) === 'number' && isFinite(value) && Math.floor(value) === value;
}

function _validateType(type, opts, numValue) {
  let expected = opts[type];

  if (type === 'is' && numValue !== expected) {
    return 'equalTo';
  } else if (type === 'lt' && numValue >= expected) {
    return 'lessThan';
  } else if (type === 'lte' && numValue > expected) {
    return 'lessThanOrEqualTo';
  } else if (type === 'gt' && numValue <= expected) {
    return 'greaterThan';
  } else if (type === 'gte' && numValue < expected) {
    return 'greaterThanOrEqualTo';
  } else if (type === 'positive' && numValue < 0) {
    return 'positive';
  } else if (type === 'odd' && numValue % 2 === 0) {
    return 'odd';
  } else if (type === 'even' && numValue % 2 !== 0) {
    return 'even';
  } else if (type === 'multipleOf' && !_isInteger(numValue / expected)) {
    return 'multipleOf';
  }

  return true;
}

export default function validateNumber(options = {}) {
  return (key, value, _, __, validatorOptions = {}) => {
    let numValue = Number(value);
    let optKeys = keys(options);
    const _buildMessage = validatorOptions.buildMessage ? validatorOptions.buildMessage : buildMessage;

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (typeof(value) === 'string' && isEmpty(value)) {
      return _buildMessage(key, 'notANumber', value, options);
    }

    if(!_isNumber(numValue)) {
      return _buildMessage(key, 'notANumber', value, options);
    }

    if(isPresent(options.integer) && !_isInteger(numValue)) {
      return _buildMessage(key, 'notAnInteger', value, options);
    }

    for (let i = 0; i < optKeys.length; i++) {
      let type = optKeys[i];
      let messageKey = _validateType(type, options, numValue);

      if (typeof messageKey === 'string') {
        return _buildMessage(key, messageKey, numValue, options);
      }
    }

    return true;
  };
}
