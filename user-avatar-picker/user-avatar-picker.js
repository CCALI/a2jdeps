import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './user-avatar-picker.stache'
import {
  Hair,
  Skin,
  Gender
} from '~/avatar/colors'

const baseAvatars = [
  { gender: 'female', isOld: false, hasWheelchair: false, ariaLabel: 'female younger standing' },
  { gender: 'female', isOld: false, hasWheelchair: true, ariaLabel: 'female younger wheelchair' },
  { gender: 'female', isOld: true, hasWheelchair: false, ariaLabel: 'female older standing' },
  { gender: 'female', isOld: true, hasWheelchair: true, ariaLabel: 'female older wheelchair' },
  { gender: 'male', isOld: false, hasWheelchair: false, ariaLabel: 'male younger standing' },
  { gender: 'male', isOld: false, hasWheelchair: true, ariaLabel: 'male younger wheelchair' },
  { gender: 'male', isOld: true, hasWheelchair: false, ariaLabel: 'male older standing' },
  { gender: 'male', isOld: true, hasWheelchair: true, ariaLabel: 'male older wheelchair' },
]

export const AvatarPick = DefineMap.extend('AvatarPick', {
  index: 'number',
  gender: 'string',
  isOld: 'boolean',
  hasWheelchair: 'boolean',
  skin: { type: Skin, default: Skin.defaultValue },
  hair: { type: Hair, default: Hair.defaultValue }
})

AvatarPick.List = DefineList.extend('AvatarPickList', {
  '#': AvatarPick
})

export const UserAvatarPickerVm = DefineMap.extend('UserAvatarPickerVm', {
  // handler passed in via parent stache
  onAvatar: {},

  hair: {
    type: Hair,
    default: Hair.defaultValue
  },

  skin: {
    type: Skin,
    default: Skin.defaultValue
  },

  gender: {
    type: Gender,
    default: Gender.defaultValue
  },

  isOld: {
    type: 'boolean',
    default: false
  },

  hasWheelchair: {
    type: 'boolean',
    default: false
  },

  avatars: {
    default: () => {
      const list = new AvatarPick.List()
      baseAvatars.forEach((avatar, index) => {
        list.push({ gender: avatar.gender, isOld: avatar.isOld, hasWheelchair: avatar.hasWheelchair, ariaLabel:avatar.ariaLabel, index })
      })
      return list
    }
  },

  femaleAvatars: {
    get () {
      return this
        .avatars
        .filter(avatar => avatar.gender === 'female')
    }
  },

  maleAvatars: {
    get () {
      return this
        .avatars
        .filter(avatar => avatar.gender === 'male')
    }
  },

  fireAvatar (index) {
    const handleAvatar = this.onAvatar
    if (handleAvatar) {
      const avatar = baseAvatars[index]
      return () => handleAvatar(avatar)
    }
  },

  isSelected (avatar) {
    const gender = this.gender
    const isOld = this.isOld
    const hasWheelchair = this.hasWheelchair

    return avatar.gender === gender &&
    avatar.isOld === isOld &&
    avatar.hasWheelchair === hasWheelchair
  },

  updateHair () {
    this.avatars.forEach((avatar) => {
      avatar.hair = this.hair
    })
  },

  updateSkin () {
    this.avatars.forEach((avatar) => {
      avatar.skin = this.skin
    })
  },

  connectedCallback () {
    const vm = this
    // handle reloaded userAvatar answers
    vm.updateHair()
    vm.updateSkin()

    vm.listenTo('hair', vm.updateHair)
    vm.listenTo('skin', vm.updateSkin)

    return () => {
      vm.stopListening('hair', vm.updateHair)
      vm.stopListening('skin', vm.updateSkin)
    }
  }
})

/**
 * @module {function} components/user-avatar-picker/ <user-avatar-picker>
 * @parent api-components
 * @signature `<user-avatar-picker>`
 */
export default Component.extend({
  view: template,
  leakScope: false,
  tag: 'user-avatar-picker',
  ViewModel: UserAvatarPickerVm
})
