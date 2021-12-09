import $ from 'jquery'
import F from 'funcunit'
import { assert } from 'chai'
import stache from 'can-stache'

import 'steal-mocha'
import '~/author-styles.less'
import './a2j-page-break'

describe('a2j-page-break', function () {
  describe('Component', function () {
    beforeEach(function () {
      const frag = stache('<div class="bootstrap-styles"><a2j-page-break /></div>')
      $('#test-area').html(frag())
    })

    afterEach(function () {
      $('#test-area').empty()
    })

    it('is not visible on screen', function (done) {
      const paragraph = F('a2j-page-break > p')

      F(function () {
        assert.strictEqual(paragraph.text(), 'Page break', 'should have the correct text')
        assert.strictEqual(paragraph.height(), 1, 'should be clipped to 1px height')
        assert.strictEqual(paragraph.width(), 1, 'should be clipped to 1px width')
      })

      F(done)
    })
  })
})
