import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEqual
} = Ember;

export default function validateConfirmation(options = {}) {
  let { on } = options;

  return (key, newValue, _oldValue, changes, validatorOptions = {}) => {
    const _buildMessage = validatorOptions.buildMessage ? validatorOptions.buildMessage : buildMessage;

    return isPresent(newValue) && isEqual(get(changes, on), newValue) ||
      _buildMessage(key, 'confirmation', newValue, options);
  };
}
