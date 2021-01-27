import CanMap from 'can-map'
import CanList from 'can-list'
import escapeStringRegexp from 'escape-string-regexp'
import _compact from 'lodash/compact'
import _includes from 'lodash/includes'

import 'can-map-define'

const occurrence = ['any', 'single', 'repeating']

const byRepeating = function (filter, variable) {
  if (filter !== 'any') {
    let repeating = filter === 'repeating'
    return variable.attr('repeating') === repeating
  } else {
    return true
  }
}

const byType = function (types, variable) {
  if (types && types.length) {
    let type = variable.attr('type') || ''
    return _includes(types, type.toLowerCase())
  } else {
    return true
  }
}

/**
 * @property {can.Map} varPicker.ViewModel
 * author/templates/elements/var-picker/
 *
 * `<var-picker>`'s viewModel.
 */
export default CanMap.extend('VarPickerVM', {
  define: {
    /**
     * @property {Number} maxSuggestionCount
     *
     * maxSuggestionCount for variableSuggestions, can override with stache
     */
    maxSuggestionCount: {
      value: 5
    },

    /**
     * @property {Boolean} disabled
     *
     * Whether the picker is disabled
     */
    disabled: {
      value: false
    },

    /**
     * @property {String} varPicker.ViewModel.prototype.selected selected
     * @parent varPicker.ViewModel
     *
     * Name of the variable selected by the user.
     */
    selected: {
      value: ''
    },

    /**
     * @property {String} varPicker.ViewModel.prototype.filterOccurrence filterOccurrence
     * @parent varPicker.ViewModel
     *
     * The variables can be either `repeating` (multiple values) or just
     * `single` value. This property filter the [variables] list by looking
     * into the `repeating` property. If the value is `any`, the value of
     * `repeating` is ignored by the filter, but if the value is `repeating`
     * only those variables with `repeating` set to true will be in the list;
     * finally if the value is `single`, only the non-repeating variables will
     * be in the list.
     */
    filterOccurrence: {
      value: 'any',
      set (value) {
        return _includes(occurrence, value) ? value : 'any'
      }
    },

    /**
     * @property {Array} varPicker.ViewModel.prototype.filterTypes filterTypes
     * @parent varPicker.ViewModel
     *
     * Array of variable types used to filter the [variable] list.
     */
    filterTypes: {
      value: '',
      set (value = '') {
        return _compact(value.split(','))
          .map(t => t.toLowerCase().trim())
      }
    },

    /**
     * @property {A2JVariable.List} varPicker.ViewModel.prototype.variables variables
     * @parent varPicker.ViewModel
     *
     * List of A2JVariable objects.
     */
    variables: {
      get (list) {
        let types = this.attr('filterTypes')
        let occurrence = this.attr('filterOccurrence')

        if (list) {
          return list
            .filter(v => byType(types, v))
            .filter(v => byRepeating(occurrence, v))
        }
      }
    },

    /**
     * @property {CanList} varPicker.ViewModel.prototype.variableSuggestions variableSuggestions
     * @parent varPicker.ViewModel
     *
     * List of search result suggestions, limited by this.maxSuggestionCount.
     */
    variableSuggestions: {
      get () {
        const hasWorkingVariable = this.isValidVarName(this.attr('selected'))
        if (hasWorkingVariable) {
          return []
        }

        const text = this.attr('selected').toLowerCase()
        if (!text) {
          return []
        }

        let names = this.attr('variableNames')
        if (!names) {
          return []
        }

        const maxSuggestionCount = this.attr('maxSuggestionCount')
        return names
          .serialize()
          .filter(name => {
            const escapedText = escapeStringRegexp(text)
            const containsText = name.toLowerCase().match(escapedText) !== null
            return containsText
          })
          .sort((a, b) => a.localeCompare(b))
          .slice(0, maxSuggestionCount)
      }
    },

    /**
     * @property {CanList} varPicker.ViewModel.prototype.variableNames variableNames
     * @parent varPicker.ViewModel
     *
     * List of variables names, this derived from the [variables] list.
     */
    variableNames: {
      get () {
        let names = new CanList([])
        let variables = this.attr('variables')

        if (variables && variables.length) {
          names = variables.map(v => v.attr('name'))
        }

        return names
      }
    },

    /**
     * @property {Number} varPicker.ViewModel.prototype.suggestionIndex suggestionIndex
     * @parent varPicker.ViewModel
     *
     * Index of current .active or hovered suggestion
     */
    suggestionIndex: {
      value: 0
    },

    /**
     * @property {Number} varPicker.ViewModel.prototype.suggestionIndexMax suggestionIndexMax
     * @parent varPicker.ViewModel
     *
     * Index of current .active or hovered suggestion
     */
    suggestionIndexMax: {
      get () {
        return this.attr('variableSuggestions').length
      }
    },

    /**
     * @property {Boolean} varPicker.ViewModel.prototype.showInvalidMessage showInvalidMessage
     * @parent varPicker.ViewModel
     *
     * Toggle warning message when no matches
     */
    showInvalidMessage: {
      get () {
        const varName = this.attr('selected')
        const notEmptyString = varName !== ''
        const notValid = !this.isValidVarName(varName)

        return notEmptyString && notValid
      }
    }
  },

  /**
   * @property {Booelan} varPicker.ViewModel.prototype.isValidVarName isValidVarName
   * @parent varPicker.ViewModel
   *
   * Check varName is in the list of variableNames
   */
  isValidVarName (varName) {
    const variableNames = this.attr('variableNames')
    return !!_includes(variableNames, varName)
  },

  /**
   * @property {Function} varPicker.ViewModel.prototype.onSuggestionSelect onSuggestionSelect
   * @parent varPicker.ViewModel
   *
   * Click handler for updating the selected name
   */
  onSuggestionSelect (name) {
    this.attr('selected', name)
    // reset suggestionIndex
    this.attr('suggestionIndex', 0)
  },

  /**
   * @property {Function} varPicker.ViewModel.prototype.onVarNameInput onVarNameInput
   * @parent varPicker.ViewModel
   *
   * Input handler to sync as a user types
   */
  onVarNameInput (ev) {
    const vm = ev.currentTarget.vm
    vm.attr('selected', ev.target.value)
  },

  /**
   * @property {Function} varPicker.ViewModel.prototype.highlightSuggestion highlightSuggestion
   * @parent varPicker.ViewModel
   *
   * handler for keyboard nav/select on the suggestion list
   */
  highlightSuggestion (targetIndex) {
    const suggestionIndexMax = this.attr('suggestionIndexMax')
    if (targetIndex !== 0 && targetIndex <= suggestionIndexMax) {
      const newTargetLi = document.querySelector(`.suggestion-list li:nth-of-type(${targetIndex})`)
      newTargetLi.classList.add('active')
    }
  },

  /**
   * @property {Function} varPicker.ViewModel.prototype.onSuggestionKeydown onSuggestionKeydown
   * @parent varPicker.ViewModel
   *
   * handler for keyboard nav/select on the suggestion list
   */
  onSuggestionKeydown (ev) {
    const vm = ev.currentTarget.vm
    let currentSuggestionIndex = vm.attr('suggestionIndex')
    let targetIndex
    const suggestionIndexMax = vm.attr('suggestionIndexMax')

    // clear any active
    vm.clearActiveClass()

    if (ev.keyCode === 40) { // arrow down
      targetIndex = currentSuggestionIndex + 1
      if (targetIndex > suggestionIndexMax) { targetIndex = suggestionIndexMax }
      vm.attr('suggestionIndex', targetIndex)
    }
    if (ev.keyCode === 38) { // arrow up
      targetIndex = currentSuggestionIndex - 1
      if (targetIndex <= 0) {
        targetIndex = 0
      }
      vm.attr('suggestionIndex', targetIndex)
    }
    // highlight suggestion
    vm.highlightSuggestion(targetIndex)

    // handle keyboard select on highlighted selection
    if (ev.keyCode === 13) { // enter
      const selectedIndex = vm.attr('suggestionIndex') - 1
      if (selectedIndex >= 0 && selectedIndex < suggestionIndexMax) {
        const selectedVarName = vm.attr('variableSuggestions')[selectedIndex]
        vm.attr('selected', selectedVarName)
        // reset suggestionIndex
        vm.attr('suggestionIndex', 0)
      }
    }
  },

  clearActiveClass () {
    document.querySelectorAll('li.suggestion-item').forEach((li) => {
      li.classList.remove('active')
    })
  },

  connectedCallback (el) {
    const vm = this
    // grab input unique to this instance
    const varNameInput = el.querySelector('.var-picker-input')
    varNameInput.addEventListener('input', this.onVarNameInput)
    varNameInput.addEventListener('keydown', this.onSuggestionKeydown)
    varNameInput.vm = vm

    const suggestionElements = document.querySelectorAll('li.suggestion-item')
    suggestionElements.forEach((el) => {
      el.addEventListener('mouseenter', this.clearActiveClass)
    })

    return () => {
      varNameInput.removeEventListener('input', this.onVarNameInput)
      varNameInput.removeEventListener('keydown', this.onSuggestionKeydown)
      suggestionElements.forEach((el) => {
        el.removeEventListener('mouseenter', this.clearActiveClass)
      })
    }
  }
})
