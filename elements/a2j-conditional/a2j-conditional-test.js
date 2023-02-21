import $ from 'jquery'
import F from 'funcunit'
import { assert } from 'chai'
import stache from 'can-stache'
import ConditionalVM from './a2j-conditional-vm'

import 'steal-mocha'
import './a2j-conditional'
import '../a2j-template/'
import '~/author-styles.less'
import testConditionalWithElse from './testConditionalWithElse.js'
import testAnswers from './testAnswers.js'
// import testConditionalSansElse from './testConditionalSansElse.js'

describe('<a2j-conditional>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new ConditionalVM({
        children: []
      })
    })

    afterEach(function () {
      vm = null
    })

    it('unaryOperation - whether only one operand is needed', function () {
      const items = [
        { operator: 'is-true', expected: true },
        { operator: 'is-false', expected: true },
        { operator: 'is-equal', expected: false },
        { operator: 'is-not-equal', expected: false },
        { operator: 'is-less-than', expected: false },
        { operator: 'is-greater-than', expected: false }
      ]

      items.forEach(function (item) {
        vm.attr('operator', item.operator)

        assert.equal(vm.attr('unaryOperation'), item.expected,
          `incorrect value for ${item.operator}`)
      })
    })
  })

  describe('Component - edit', function () {
    let vm

    beforeEach(function () {
      const frag = stache(
        '<a2j-conditional children:from="children" />'
      )

      $('#test-area').html(frag({
        editEnabled: true,
        editActive: true,
        children: []
      }))

      vm = $('a2j-conditional')[0].viewModel
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('toggles "else panel" based on [elseClause] value', function () {
      vm.attr('elseClause', false)
      assert.isFalse($('.panel-else').is(':visible'))
      assert.lengthOf($('.panel-body'), 1, 'only if body should be rendered')

      vm.attr('elseClause', true)
      assert.isTrue($('.panel-else').is(':visible'))
      assert.lengthOf($('.panel-body'), 2, 'if and else body should be rendered')
    })

    describe('element options pane', function () {
      beforeEach(function () {
        vm.attr('editActive', true)
        vm.attr('editEnabled', true)
      })

      it('options pane is toggled based on [editActive] value', function (done) {
        vm.attr('editActive', true)
        F('element-options-pane').visible('options pane should be visible')

        F(() => vm.attr('editActive', false))
        F('element-options-pane').missing('options pane should be gone')

        F(done)
      })

      // this test passes when running this file directly,
      // but times out when run from main tests.js file
      it.skip('toggles right operand form group based on [unaryOperation] value', function (done) {
        vm.attr('operator', 'is-true')
        F('.right-operand').css('visibility', 'hidden', 'visibility should be hidden')

        F(() => vm.attr('operator', 'is-greater-than'))

        F('.right-operand').css('visibility', 'visible', 'visibility should be visible')

        F(done)
      })
    })
  })

  describe.only('Component - rendered', function () {
    let vm

    beforeEach(function () {
      const frag = stache(
        '<a2j-conditional children:from="children" />'
      )

      $('#test-area').html(frag({
        editEnabled: false,
        editActive: false,
        children: testConditionalWithElse.children,
        state: testConditionalWithElse.state
      }))

      vm = $('a2j-conditional')[0].viewModel
      vm.attr('answers', testAnswers)
      vm.attr('editEnabled', false)
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('renders nothing when if condition fails without an else panel', function () {
      assert.isFalse($('.panel-else').is(':visible'))
      assert.lengthOf($('.with-conditional'), 1, 'only if body should be rendered')
    })
  })
})
