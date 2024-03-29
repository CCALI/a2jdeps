import $ from 'jquery'
import F from 'funcunit'
import { assert } from 'chai'
import stache from 'can-stache'
import A2JTemplateVM from './a2j-template-vm'
import A2JTemplate from '../../models/a2j-template'
import templateFixture from '~/models/fixtures-author/templates/guide20-template2114'

import 'steal-mocha'
import './a2j-template'

function makeA2JTemplate ({ rootNode }) {
  const docTree = A2JTemplate.makeDocumentTree(rootNode)
  const template = new A2JTemplate()

  template.attr('rootNode', docTree)
  return template
}

describe('a2j-template', function () {
  describe('Component', function () {
    beforeEach(function () {
      const template = makeA2JTemplate(templateFixture)

      const frag = stache(
        '<a2j-template id="page-template"editEnabled:from="true" vm:template:bind="template" />'
      )

      $('#test-area').html(frag({ template }))
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    describe('only one element can be selected at a time', function () {
      this.timeout(5000)

      it('selecting direct descendants', function (done) {
        const firstElementVM = $('element-container').eq(0)[0].viewModel
        const secondElementVM = $('element-container').eq(1)[0].viewModel

        F('element-options-pane').size(0, 'no element selected')

        // dblclick the first element
        F('element-container:nth(0) .wrapper').dblclick()

        F(function () {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected')
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        // dblclick the second element
        F('element-container:nth(1) .wrapper').dblclick()

        F(function () {
          assert.isTrue(secondElementVM.attr('selected'), 'second element should be selected')
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        F(done)
      })

      it('selecting nested child then a direct descendant', function (done) {
        const firstElementVM = $('element-container').eq(0)[0].viewModel
        const secondElementVM = $('element-container').eq(1)[0].viewModel
        const nestedChildVM = $('conditional-add-element').eq(0)[0].viewModel

        // click conditional add element (add ot if inside a2j-conditional)
        F('conditional-add-element > div').click()

        F(function () {
          assert.isTrue(nestedChildVM.attr('selected'), 'nested child should be selected')
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected')
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        // dblclick the first element
        F('element-container:nth(0) .wrapper').dblclick()

        F(function () {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected')
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected')
          assert.isFalse(nestedChildVM.attr('selected'), 'nested child should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        F(done)
      })

      it('selecting a direct descendant then a nested child', function (done) {
        const firstElementVM = $('element-container').eq(0)[0].viewModel
        const secondElementVM = $('element-container').eq(1)[0].viewModel
        const nestedChildVM = $('conditional-add-element').eq(0)[0].viewModel

        // dblclick the first element
        F('element-container:nth(0) .wrapper').dblclick()

        F(function () {
          assert.isTrue(firstElementVM.attr('selected'), 'first element should be selected')
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected')
          assert.isFalse(nestedChildVM.attr('selected'), 'nested child should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        // click conditional add element (add to if inside a2j-conditional)
        F('conditional-add-element > div').click()

        F(function () {
          assert.isTrue(nestedChildVM.attr('selected'), 'nested child should be selected')
          assert.isFalse(firstElementVM.attr('selected'), 'first element should not be selected')
          assert.isFalse(secondElementVM.attr('selected'), 'second element should not be selected')
        })

        // there should be only one options pane on screen
        F('element-options-pane').size(1)

        F(done)
      })
    })
  })

  describe('viewModel', function () {
    it('getChildById works', function () {
      const template = makeA2JTemplate(templateFixture)
      const vm = new A2JTemplateVM({ template })

      const child = vm.getChildById('citvkuui300013k6a8n9329e9')
      assert.equal(child.attr('tag'), 'a2j-conditional')
    })

    it('fontProperties', function () {
      const template = makeA2JTemplate(templateFixture)
      const vm = new A2JTemplateVM({ template })
      vm.attr('template.rootNode.state.fontSize', 12)
      vm.attr('template.rootNode.state.fontFamily', 'courier-new')
      let fontProperties = vm.attr('fontProperties')
      let expectedResults = 'font-family: \'Courier New\', Courier, \'Lucida Sans Typewriter\', \'Lucida Typewriter\', monospace; font-size: 12px;'
      assert.deepEqual(expectedResults, fontProperties, 'should get fontProperties from vm.rootNode.state if they exist')

      // remove rootNode, set parentState, and test for fonts
      vm.attr('parentState', { fontSize: 13, fontFamily: 'sans-serif' })
      vm.attr('template.rootNode.state.fontSize', null)
      vm.attr('template.rootNode.state.fontFamily', null)

      fontProperties = vm.attr('fontProperties')
      expectedResults = 'font-family: \'Open Sans\', sans-serif; font-size: 13px;'
      assert.deepEqual(expectedResults, fontProperties, 'should get fontProperties from vm.parentState if rootNode.state does not have fontSize/fontFamily')
    })
  })
})
