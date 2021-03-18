import { assert } from 'chai'
import { SkinPickerVm } from './skin-picker'

import 'steal-mocha'

describe('<skin-picker>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new SkinPickerVm()
    })

    it('selectedSkinClass', () => {
      // emulate setting via stache binding
      vm.attr('selectedSkin', 'darker')
      assert.equal(vm.attr('selectedSkinClass'), 'skin-darker', 'should derive selectedSkinClass from selectedSkin')
    })
  })
})
