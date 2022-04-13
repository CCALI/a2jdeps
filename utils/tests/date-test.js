import { assert } from 'chai'
import moment from 'moment'
import cDate from '~/utils/date'

describe('util: date', function () {
  let testDate

  beforeEach(function () {
    testDate = moment('02/28/1970', 'MM/DD/YYYY')
  })

  describe('swapMonthAndDay', function () {
    it('returns mm/dd/yyyy if given dd/mm/yyyy', function () {
      const usDate = '02/24/1980'
      const britDate = cDate.swapMonthAndDay(usDate)
      assert.equal(britDate, '24/02/1980', 'failed to create brit date')
    })

    it('returns dd/mm/yyyy if given mm/dd/yyyy', function () {
      const britDate = '17/04/1988'
      const usDate = cDate.swapMonthAndDay(britDate)
      assert.equal(usDate, '04/17/1988', 'failed to create US date')
    })
  })

  describe('dateToString', function () {
    it('should return a string date given a moment object', function () {
      const stringDate = cDate.dateToString(testDate)

      assert.equal(stringDate, '02/28/1970', 'did not format moment date')
    })

    it('should handle number of days since epoch', function () {
      const numDays = 58 // '02/28/1970'
      const stringDate = cDate.dateToString(numDays)

      assert.equal(stringDate, '02/28/1970', 'did not format days since epoch')
    })

    it('should handle a string date', function () {
      const sourceString = '02/28/1970'
      const stringDate = cDate.dateToString(sourceString)

      assert.equal(stringDate, '02/28/1970', 'did not format string to string')
    })

    it('should re-format a string date to new format', function () {
      const sourceString = '02/12/1970'
      const stringDate = cDate.dateToString(sourceString, 'DD-MM-YYYY')

      assert.equal(stringDate, '12-02-1970', 'did not format string to new string format')
    })
  })

  describe('dateToDays', function () {
    it('should convert a moment object to days since epoch', function () {
      const numDays = cDate.dateToDays(testDate) // 58

      assert.equal(numDays, 58, 'failed to convert moment object to days')
    })

    it('should also convert a string date to days', function () {
      const stringDate = '02/28/1970'
      const numDays = cDate.dateToDays(stringDate)

      assert.equal(numDays, 58, 'did not handle string date')
    })
  })

  describe('daysToDate', function () {
    it('should convert days since epoch to a moment object', function () {
      const numDays = 58
      const date = cDate.daysToDate(numDays)

      assert.equal(date._isAMomentObject, true, 'did not return a moment object')
      assert.equal(date.format('MM/DD/YYYY'), '02/28/1970', 'date from days did not match')
    })
  })

  describe('dateDiff', function () {
    it('should return a positive number of days when most recent date is first', function () {
      const endDate = moment('01/01/1970')
      const daysDiff = cDate.dateDiff(testDate, endDate)

      assert.equal(daysDiff, 58, 'failed to compute number of days')
    })

    it('should return a negative number of days when most recent date is second', function () {
      const endDate = moment('01/01/1970')
      const daysDiff = cDate.dateDiff(endDate, testDate)

      assert.equal(daysDiff, -58, 'failed to compute negative number of days')
    })

    it('should return number of years if passed 3rd param "years"', function () {
      const endDate = moment('01/01/2000')
      const startDate = moment('01/01/2010')
      const yearsDiff = cDate.dateDiff(startDate, endDate, 'years')

      assert.equal(yearsDiff, 10, 'did not compute 10 years')
    })
  })
})
