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
  isBlank
} = Ember;

function _isPresent(value) {
  if (value instanceof Ember.ObjectProxy || value instanceof Ember.ArrayProxy) {
    return _isPresent(get(value, 'content'));
  }

  return isPresent(value);
}

function _testPresence(key, value, presence) {
  if (presence) {
    return _isPresent(value) || 'present';
  } else {
    return isBlank(value) || 'blank';
  }
}

export default function validatePresence(opts) {
  return (key, value, _, __, validatorOptions = {}) => {
    const _buildMessage = validatorOptions.buildMessage ? validatorOptions.buildMessage : buildMessage;

    const isBooleanOption = typeof opts === 'boolean';

    const context = isBooleanOption ? {} : opts;
    const presence = isBooleanOption ? opts : opts.presence;
    const messageKey = _testPresence(key, value, presence, context);

    return typeof messageKey === 'string' ?
      _buildMessage(key, messageKey, value, context) :
      messageKey;
  };
}
