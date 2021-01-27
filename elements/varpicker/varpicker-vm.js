import $ from 'jquery'
import CanMap from 'can-map'
import CanList from 'can-list'
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

        const maxSuggestionCount = 5
        return names
          .serialize()
          .filter(name => {
            const containsText = name.toLowerCase().match(text) !== null
            return containsText
          })
          .sort((a, b) => a.localeCompare(b))
          .slice(0, maxSuggestionCount)
      }
    },

    /**
     * @property {can.List} varPicker.ViewModel.prototype.variableNames variableNames
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

    hoveredSuggestionIndex: {
      value: 0

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
        const suggestionsShowing = this.attr('variableSuggestions').length
        const notValid = !this.isValidVarName(varName)

        return notEmptyString && suggestionsShowing && notValid
      }
    }
  },

  isValidVarName (varName) {
    const variableNames = this.attr('variableNames')
    return _includes(variableNames, varName)
  },

  onSuggestionSelect (name) {
    this.attr('selected', name)
  },

  connectedCallback (el) {
    let vm = el.viewModel
    const varNameInput = el.querySelector('.var-picker-input')
    const inputHandler = (ev) => {
      vm.attr('selected', ev.target.value)
    }
    varNameInput.addEventListener('input', inputHandler)

    $('li.suggestion-item').mouseenter((ev) => {
      // clear any active
      $('li.suggestion-item').removeClass('active')
    })

    const keydownHandler = (ev) => {
      let currentHoveredIndex = vm.attr('hoveredSuggestionIndex')
      let targetIndex
      const targetMax = vm.attr('variableSuggestions').length

      // clear any active
      $('li.suggestion-item.active').removeClass('active')

      if (ev.keyCode === 40) { // arrow down
        targetIndex = currentHoveredIndex + 1
        if (targetIndex > targetMax) { targetIndex = targetMax }
        vm.attr('hoveredSuggestionIndex', targetIndex)
        console.log('arrow down')
      }
      if (ev.keyCode === 38) { // arrow up
        targetIndex = currentHoveredIndex - 1
        if (targetIndex <= 0) {
          targetIndex = 0
        }
        vm.attr('hoveredSuggestionIndex', targetIndex)
        console.log('arrow up')
      }

      if (targetIndex !== 0 && targetIndex <= targetMax) {
        const $newTargetLi = $(`.suggestion-list li:nth-of-type(${targetIndex})`)
        $newTargetLi.addClass('active')
        console.log('newTargetLi', $newTargetLi, targetIndex, targetMax)
      }

      if (ev.keyCode === 13) { // enter
        const selectedIndex = vm.attr('hoveredSuggestionIndex') - 1
        if (selectedIndex >= 0 && selectedIndex < targetMax) {
          const selectedVarName = vm.attr('variableSuggestions')[selectedIndex]
          vm.attr('selected', selectedVarName)
          console.log('setting selected', selectedVarName)
        }
      }

      console.log(ev.keyCode)
    }

    varNameInput.addEventListener('keydown', keydownHandler)

    return () => {
      varNameInput.removeEventListener('input', inputHandler)
      varNameInput.removeEventListener('keydown', keydownHandler)
    }
  }
})
