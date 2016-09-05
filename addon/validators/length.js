/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEmpty,
  isNone,
  typeOf
} = Ember;

export default function validateLength(options = {}) {
  let { allowBlank, is, min, max } = options;

  return (key, value, _, __, validatorOptions = {}) => {
    if (allowBlank && isEmpty(value)) {
      return true;
    }

    const _buildMessage = validatorOptions.buildMessage ? validatorOptions.buildMessage : buildMessage;

    if (isNone(value)) {
      return _buildMessage(key, 'invalid', value, options);
    }

    let length = get(value, 'length');

    if (isPresent(is) && typeOf(is) === 'number') {
      return length === is || _buildMessage(key, 'wrongLength', value, options);
    }

    if (isPresent(min) && isPresent(max)) {
      return (length >= min && length <= max) || _buildMessage(key, 'between', value, options);
    }

    if (isPresent(min) && isEmpty(max)) {
      return length >= min || _buildMessage(key, 'tooShort', value, options);
    }

    if (isPresent(max) && isEmpty(min)) {
      return length <= max || _buildMessage(key, 'tooLong', value, options);
    }

    return true;
  };
}
