
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
dayjs.extend(UTC)
const _out = function (fnName, args) {
  return {
    [this.key.start]: this.startDate[fnName](...args),
    [this.key.end]: this.endDate[fnName](...args)
  }
}
class FindByDate {
  constructor ({ start, end, offset, key = [], utc }) {
    const getInstance = (s) => {
      if (utc) return dayjs.utc(s)
      return dayjs(s)
    }
    this.startDate = getInstance(start)
    this.endDate = end ? getInstance(end).add(1, 'day') : getInstance(start).add(1, 'day')
    if (offset) {
      this.startDate = this.startDate.add(offset, 'hour')
      this.endDate = this.endDate.add(offset, 'hour')
    }
    this.key = {}
    this.key.start = key[0] || '$gte'
    this.key.end = key[1] || '$lte'
    if (utc) {
      this.startDate.utc()
      this.endDate.utc()
    }
  }

  unix (...args) {
    return _out.call(this, 'unix', args)
  }
  valueOf (...args) {
    return _out.call(this, 'valueOf', args)
  }
  toJSON (...args) {
    return _out.call(this, 'toJSON', args)
  }
  toISOString (...args) {
    return _out.call(this, 'toISOString', args)
  }
  toString (...args) {
    return _out.call(this, 'toString', args)
  }
  toDate (...args) {
    return _out.call(this, 'toDate', args)
  }
  format (...args) {
    return _out.call(this, 'format', args)
  }
}

module.exports = FindByDate
