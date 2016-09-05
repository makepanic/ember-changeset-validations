import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import isObject from 'ember-changeset/utils/is-object';

const { Helper: { helper } } = Ember;

export function changeset([model, validationMap], hash = {}) {
  if (isObject(validationMap)) {
    return new Changeset(model, lookupValidator(validationMap, hash.validatorOptions), validationMap);
  }

  return new Changeset(model, validationMap);
}

export default helper(changeset);
