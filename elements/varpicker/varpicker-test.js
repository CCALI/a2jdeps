import { assert } from 'chai'
import CanList from 'can-list'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import A2JVariable from '~/models/a2j-variable'
import VarPickerVM from './varpicker-vm'
import './varpicker'

import 'steal-mocha'

const testVariables = {
  childcounter: {
    name: 'ChildCounter',
    type: 'Number',
    repeating: false,
    values: [null, 3]
  },

  'first name': {
    name: 'First Name',
    type: 'Text',
    repeating: false,
    values: [null, 'John']
  },

  'child name': {
    name: 'Child Name',
    type: 'Text',
    repeating: true,
    values: [null, 'Bart', 'Lisa', 'Maggie']
  }
}

describe('<var-picker>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new VarPickerVM({
        variables: A2JVariable.fromGuideVars(testVariables)
      })
    })

    it('variableNames - a list of variable names', () => {
      let names = vm.attr('variableNames')

      assert.instanceOf(names, CanList)
      assert.include(names.attr(), 'Child Name')
      assert.include(names.attr(), 'First Name')
      assert.include(names.attr(), 'ChildCounter')
    })

    it('filterTypes - array of types from a comma separated string', () => {
      vm.attr('filterTypes', 'number, Text')
      assert.deepEqual(vm.attr('filterTypes'), ['number', 'text'])
    })

    it('variables - list of variables filtered properly', () => {
      assert.deepEqual(vm.attr('filterTypes'), [])
      assert.equal(vm.attr('filterOccurrence'), 'any', 'default value')

      assert.equal(vm.attr('variables.length'), 3,
        'no filters set so it should have all variables')

      vm.attr('filterOccurrence', 'single')
      assert.equal(vm.attr('variables.length'), 2,
        'there are two non-repeating variables')

      vm.attr('filterTypes', 'text')
      assert.equal(vm.attr('variables.length'), 1,
        'there is only one non-repeating variable that is text')
      assert.equal(vm.attr('variables.0.name'), 'First Name')
    })

    it('variableSuggestions', () => {
      let variableSuggestions = vm.attr('variableSuggestions')
      let expectedResult = []

      vm.attr('selected', 'ChildCounter')
      variableSuggestions = vm.attr('variableSuggestions')
      assert.deepEqual(variableSuggestions, expectedResult, 'should return empty list with current valid varName')

      vm.attr('selected', '')
      variableSuggestions = vm.attr('variableSuggestions')
      assert.deepEqual(variableSuggestions, expectedResult, 'should return empty list with default selected value of empty string')

      vm.attr('selected', 'name')
      expectedResult = [ 'Child Name', 'First Name' ]
      variableSuggestions = vm.attr('variableSuggestions')
      assert.deepEqual(variableSuggestions, expectedResult, 'should return list of matches')

      vm.attr('variables', [])
      expectedResult = []
      variableSuggestions = vm.attr('variableSuggestions')
      assert.deepEqual(variableSuggestions, expectedResult, 'should return empty list if no variables list')
    })

    it('showInvalidMessage', () => {
      let showInvalidMessage = vm.attr('showInvalidMessage')
      assert.equal(showInvalidMessage, false, 'defaults to false based on default selected value of empty string')

      vm.attr('selected', 'ChildCounter')
      showInvalidMessage = vm.attr('showInvalidMessage')
      assert.equal(showInvalidMessage, false, 'false when selected value has good match in varNames list')

      vm.attr('selected', 'ChildCou')
      showInvalidMessage = vm.attr('showInvalidMessage')
      assert.equal(showInvalidMessage, true, 'shows message when not match but not empty string')
    })

    it('isValidVarName()', () => {
      let isValidVarName = vm.isValidVarName('')
      assert.equal(isValidVarName, false, 'invalid on empty')

      isValidVarName = vm.isValidVarName('ChildCou')
      assert.equal(isValidVarName, false, 'invalid when no match')

      isValidVarName = vm.isValidVarName('ChildCounter')
      assert.equal(isValidVarName, true, 'valid on match')
    })

    it('onSuggestionSelect()', () => {
      vm.attr('suggestionIndex', 4)
      vm.onSuggestionSelect('foo')
      const selected = vm.attr('selected')

      assert.equal(selected, 'foo', 'sets selected to passed value')
      assert.equal(vm.attr('suggestionIndex'), 0, 'resets suggestionIndex to 0')
    })

    it('onVarNameInput()', () => {
      const testEvent = {
        currentTarget: {
          vm
        },
        target: {
          value: 'foo'
        }
      }

      vm.onVarNameInput(testEvent)
      const selected = vm.attr('selected')

      assert.equal(selected, 'foo', 'sets selected to ev.target.value')
    })
  })

  describe('Component', () => {
    const render = (data) => {
      const tpl = stache('<var-picker variables:from="variables" />')
      document.querySelector('#test-area').appendChild(tpl(data))
      return canViewModel('var-picker')
    }
    const variables = A2JVariable.fromGuideVars(testVariables)
    let vm

    beforeEach(() => {
      vm = render({ variables })
    })

    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    it('onSuggestionKeydown()', () => {
      // set selected to get some suggestions
      vm.attr('selected', 'Chi')
      // simulate starting on suggestion 1 highlighted by keyboard nav
      vm.attr('suggestionIndex', 1)

      const testCases = [
        { keyCode: 40, attrsToTest: [ 'suggestionIndex' ], expectedResults: [ 2 ] },
        { keyCode: 38, attrsToTest: [ 'suggestionIndex' ], expectedResults: [ 1 ] },
        { keyCode: 13, attrsToTest: [ 'selected', 'suggestionIndex' ], expectedResults: [ 'Child Name', 0 ] }
      ]

      let testEvent
      testCases.forEach((testCase) => {
        testEvent = testEvent = { keyCode: testCase.keyCode, currentTarget: { vm } }
        vm.onSuggestionKeydown(testEvent)

        testCase.attrsToTest.forEach((attr, index) => {
          const attrValue = vm.attr(attr)
          const expectedResult = testCase.expectedResults[index]
          assert.equal(attrValue, expectedResult, 'sets attrs to correct values based on ev.keyCode')
        })
      })
    })
  })
})
