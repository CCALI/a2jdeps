import 'steal-mocha'
import 'models/fixtures-author/templates'
import './a2j-template-ssr'

import $ from 'jquery'
import { assert } from 'chai'
import CanList from 'can-list'
import F from 'funcunit'
import stache from 'can-stache'
import template2115 from '~/models/fixtures-author/templates/guide1261-template2115'
import TemplateSsrVM from './a2j-template-ssr-vm'

describe('a2j-template-ssr', function () {
  describe('viewModel', function () {
    it('templatesPromise resolves a list of templates', function (done) {
      const vm = new TemplateSsrVM({ guideId: '1261', templateId: '2112' })

      vm.attr('templatesPromise').then(templates => {
        assert(templates instanceof CanList)
        done()
      })
    })
  })

  describe('Component', function () {
    describe('template without a custom header and footer', () => {
      beforeEach(function () {
        const frag = stache(
          '<a2j-template-ssr guideId:from="guideId" templateId:from="templateId" />'
        )
        $('#test-area').html(frag({ guideId: '1261', templateId: '2112' }))
      })

      afterEach(function () {
        $('#test-area').empty()
      })

      it('does not render a custom header or footer', function (done) {
        F('a2j-template-ssr a2j-template').visible('template should be visible')
        F('a2j-template-ssr footer').missing('custom footer should not be visible')
        F('a2j-template-ssr header').missing('custom header should not be visible')
        F(done)
      })
    })

    describe('template with a custom header and footer', () => {
      describe('when renderTemplateFootersAndHeaders is false', () => {
        beforeEach(function () {
          const frag = stache(
            '<a2j-template-ssr guideId:from="guideId" renderTemplateFootersAndHeaders:from="renderTemplateFootersAndHeaders" templateId:from="templateId" />'
          )
          $('#test-area').html(frag({
            guideId: '1261',
            renderTemplateFootersAndHeaders: false,
            templateId: '2115'
          }))
        })

        afterEach(function () {
          $('#test-area').empty()
        })

        it('does not render a custom header or footer', function (done) {
          F('a2j-template-ssr a2j-template').visible('template should be visible')
          F('a2j-template-ssr footer p').missing('custom footer should not be visible')
          F('a2j-template-ssr header p').missing('custom header should not be visible')
          F(done)
        })
      })

      describe('when renderTemplateFootersAndHeaders is true', () => {
        beforeEach(function () {
          const frag = stache(
            '<a2j-template-ssr guideId:from="guideId" renderTemplateFootersAndHeaders:from="renderTemplateFootersAndHeaders" templateId:from="templateId" />'
          )
          $('#test-area').html(frag({
            guideId: '1261',
            renderTemplateFootersAndHeaders: true,
            templateId: '2115'
          }))
        })

        afterEach(function () {
          $('#test-area').empty()
        })

        it('renders the custom headers and footers', function (done) {
          F('a2j-template-ssr footer p').visible('custom footer should be visible')
          F('a2j-template-ssr header p').visible('custom header should be visible')

          F(function () {
            assert.strictEqual(F('a2j-template-ssr footer')[0].innerHTML, template2115.footer, 'should have the custom footer text')
            assert.strictEqual(F('a2j-template-ssr header')[0].innerHTML, template2115.header, 'should have the custom header text')
          })

          F(done)
        })
      })
    })
  })
})
