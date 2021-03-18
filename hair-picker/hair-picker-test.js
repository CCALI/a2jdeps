import { assert } from 'chai'
import { HairPickerVm } from './hair-picker'

import 'steal-mocha'

describe('<hair-picker>', function () {
  describe('viewModel', function () {
    let vm

    beforeEach(function () {
      vm = new HairPickerVm()
    })

    it('selectedHairClass', () => {
      // emulate setting via stache binding
      vm.attr('selectedHair', 'red')
      assert.equal(vm.attr('selectedHairClass'), 'hair-red', 'should derive selectedHairClass from selectedHair')
    })
  })
})
