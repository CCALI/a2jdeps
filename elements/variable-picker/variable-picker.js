import Component from 'can-component'
import VarPickerVM from './variable-picker-vm'
import template from './variable-picker.stache'

/**
 * @module {Module} author/templates/elements/variable-picker/ <variable-picker>
 * @parent api-components
 *
 * This is an input-like component that supports tagging and uses Can List to
 * filter results in a given collection while user types. It is intented to allow
 * the user to pick a variable from the ones defined in a guided interview.
 *
 * ## Use
 *
 * @codestart
 *   <variable-picker {variables}="guide.vars" {^selected-variable}="selected" />
 * @codeend
 */

export default Component.extend({
  view: template,
  tag: 'variable-picker',
  ViewModel: VarPickerVM,

  leakScope: true
})
