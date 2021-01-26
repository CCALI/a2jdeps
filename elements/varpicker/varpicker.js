import Component from 'can-component'
import VarPickerVM from './varpicker-vm'
import template from './varpicker.stache'

/**
 * @module {Module} author/templates/elements/var-picker/ <var-picker>
 * @parent api-components
 *
 * This is an input-like component that supports tagging and uses typeahead to
 * filter results in a given collection while user types. It is intented to allow
 * the user to pick a variable from the ones defined in a guided interview.
 *
 * ## Use
 *
 * @codestart
 *   <var-picker {variables}="guide.vars" {^selected-variable}="selected" />
 * @codeend
 */

export default Component.extend({
  view: template,
  tag: 'var-picker',
  ViewModel: VarPickerVM,

  leakScope: true
})
