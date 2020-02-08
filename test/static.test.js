const MongoWrapper = require('..')

describe('toBulkArray', () => {
  const { toBulkArray } = MongoWrapper
  it('basic', () => {
    const data = [{ _id: 1, a: 11 }]
    const result = [
      {
        'updateOne': {
          'filter': { '_id': 1 },
          'update': { '_id': 1, 'a': 11 },
          'upsert': true
        }
      }
    ]
    expect(toBulkArray(data)).toEqual(result)
  })
  it('select id', () => {
    const data = [{ x: 1, a: 11 }]
    const result = [
      {
        'updateOne': {
          'filter': { '_id': 1 },
          'update': { '_id': 1, 'a': 11, x: 1 },
          'upsert': true
        }
      }
    ]
    expect(toBulkArray(data, 'x')).toEqual(result)
  })
  it('not id', async () => {
    const data = [{ a: 1, b: 2 }]
    expect(() => {
      toBulkArray(data)
    }).toThrowError()
  })
  it('not id', async () => {
    const data = [{ a: 1, b: 2 }, { c: 3 }]
    expect(() => {
      toBulkArray(data, 'a')
    }).toThrowError()
  })
})
describe('findByDateQuery', () => {
  const { findByDateQuery } = MongoWrapper

  it('format ', () => {
    const _q = {
      start: '2019-09-23'
    }
    expect(findByDateQuery(_q).format()).toEqual(
      {
        '$gte': '2019-09-23T00:00:00+09:00',
        '$lte': '2019-09-24T00:00:00+09:00'
      })
  })
  it('format with endDate', () => {
    const _q = {
      start: '2019-09-23',
      end: '2019-10-23'
    }
    expect(findByDateQuery(_q).format()).toEqual(
      {
        '$gte': '2019-09-23T00:00:00+09:00',
        '$lte': '2019-10-24T00:00:00+09:00'
      })
  })
  it('offset', () => {
    const _q = {
      start: '2019-09-23',
      end: '2019-10-23',
      offset: 9
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$gte': '2019-09-23T00:00:00.000Z',
        '$lte': '2019-10-24T00:00:00.000Z'
      })
  })
  it('offset minus', () => {
    const _q = {
      start: '2019-09-23',
      end: '2019-10-23',
      offset: -9
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$gte': '2019-09-22T06:00:00.000Z',
        '$lte': '2019-10-23T06:00:00.000Z'
      })
  })
  it('key', () => {
    const _q = {
      start: '2019-09-23',
      key: ['$a', '$b']
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$a': '2019-09-22T15:00:00.000Z',
        '$b': '2019-09-23T15:00:00.000Z'
      })
  })
  describe('display', () => {
    const _q = {
      start: '2019-09-23',
      end: '2019-10-23'
    }
    it('unix', () => {
      expect(findByDateQuery(_q).unix()).toEqual(
        {
          '$gte': 1569164400,
          '$lte': 1571842800
        })
    })
    it('valueOf', () => {
      expect(findByDateQuery(_q).valueOf()).toEqual(
        {
          '$gte': 1569164400000,
          '$lte': 1571842800000
        })
    })
    it('toJSON', () => {
      expect(findByDateQuery(_q).toJSON()).toEqual(
        {
          '$gte': '2019-09-22T15:00:00.000Z',
          '$lte': '2019-10-23T15:00:00.000Z'
        })
    })
    it('toISOString', () => {
      expect(findByDateQuery(_q).toISOString()).toEqual(
        findByDateQuery(_q).toJSON())
    })
    it('toString', () => {
      expect(findByDateQuery(_q).toString()).toEqual(
        {
          '$gte': 'Sun, 22 Sep 2019 15:00:00 GMT',
          '$lte': 'Wed, 23 Oct 2019 15:00:00 GMT'
        })
    })
  })
})
