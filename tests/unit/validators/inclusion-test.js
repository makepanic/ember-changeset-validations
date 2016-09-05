import validateInclusion from 'ember-changeset-validations/validators/inclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | inclusion');

test('it accepts a `list` option', function(assert) {
  let key = 'title';
  let options = { list: ['Manager', 'VP', 'Director'] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, 'inclusion', '', options));
  assert.equal(validator(key, 'Executive'), buildMessage(key, 'inclusion', 'Executive', options));
  assert.equal(validator(key, 'Manager'), true);
});

test('it accepts a `range` option', function(assert) {
  let key = 'age';
  let options = { range: [18, 60] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, 'inclusion', '', options));
  assert.equal(validator(key, 61), buildMessage(key, 'inclusion', 61, options));
  assert.equal(validator(key, 21), true);
});

test('it can output custom message string', function(assert) {
  let key = 'age';
  let options = { range: [18, 60], message: 'Your {description} is invalid, should be within {range}' };
  let validator = validateInclusion(options);

  assert.equal(validator(key, 92), 'Your Age is invalid, should be within 18,60', 'custom message string is generated correctly');
});

test('it can output custom message function', function(assert) {
  assert.expect(4);

  let key = 'age';
  let options = {
    list: ['Something'],
    message: function(_key, type, value) {
      assert.equal(_key, key);
      assert.equal(type, 'inclusion');
      assert.equal(value, 'Test');

      return 'some test message';
    }
  };
  let validator = validateInclusion(options);

  assert.equal(validator(key, 'Test'), 'some test message', 'custom message function is returned correctly');
});


module('custom message builder', function() {
  function customMessageBuilder(key, type, newValue, options) {
    return `${key}_${type}_${!!newValue}_${JSON.stringify(options)}`;
  }

  test('it accepts a `list` option', function(assert) {
    let key = 'title';
    let options = { list: ['Manager', 'VP', 'Director'] };
    let validator = validateInclusion(options);

    assert.equal(validator(key, '', undefined, undefined, {buildMessage: customMessageBuilder}), customMessageBuilder(key, 'inclusion', '', options));
    assert.equal(validator(key, 'Executive', undefined, undefined, {buildMessage: customMessageBuilder}), customMessageBuilder(key, 'inclusion', 'Executive', options));
    assert.equal(validator(key, 'Manager', undefined, undefined, {buildMessage: customMessageBuilder}), true);
  });

  test('it accepts a `range` option', function(assert) {
    let key = 'age';
    let options = { range: [18, 60] };
    let validator = validateInclusion(options);

    assert.equal(validator(key, '', undefined, undefined, {buildMessage: customMessageBuilder}), customMessageBuilder(key, 'inclusion', '', options));
    assert.equal(validator(key, 61, undefined, undefined, {buildMessage: customMessageBuilder}), customMessageBuilder(key, 'inclusion', 61, options));
    assert.equal(validator(key, 21, undefined, undefined, {buildMessage: customMessageBuilder}), true);
  });

});
