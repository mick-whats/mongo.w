const MongoWrapper = require('..')

describe('findByDateQuery utc', () => {
  const { findByDateQuery } = MongoWrapper
  const testStart = '2019-09-23'
  const testend = '2019-10-23'
  // const testend2 = '2019-09-23'
  it('format ', () => {
    const _q = {
      start: testStart,
      utc: true
    }
    expect(findByDateQuery(_q).format()).toEqual(
      {
        '$gte': '2019-09-23T00:00:00Z',
        '$lte': '2019-09-24T00:00:00Z'
      })
  })
  it('format with endDate', () => {
    const _q = {
      start: testStart,
      end: testend,
      utc: true
    }
    expect(findByDateQuery(_q).format()).toEqual(
      {
        '$gte': '2019-09-23T00:00:00Z',
        '$lte': '2019-10-24T00:00:00Z'
      })
  })
  it('offset', () => {
    const _q = {
      start: testStart,
      end: testend,
      offset: 9,
      utc: true
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$gte': '2019-09-23T09:00:00.000Z',
        '$lte': '2019-10-24T09:00:00.000Z'
      })
  })
  it('offset minus', () => {
    const _q = {
      start: testStart,
      end: testend,
      offset: -9,
      utc: true
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$gte': '2019-09-22T15:00:00.000Z',
        '$lte': '2019-10-23T15:00:00.000Z'
      })
  })
  it('key', () => {
    const _q = {
      start: testStart,
      key: ['$a', '$b'],
      utc: true
    }
    expect(findByDateQuery(_q).toJSON()).toEqual(
      {
        '$a': '2019-09-23T00:00:00.000Z',
        '$b': '2019-09-24T00:00:00.000Z'
      })
  })
  describe('display', () => {
    const _q = {
      start: testStart,
      end: testend,
      utc: true
    }
    it('unix', () => {
      expect(findByDateQuery(_q).unix()).toEqual(
        {
          '$gte': 1569196800,
          '$lte': 1571875200
        })
    })
    it('valueOf', () => {
      expect(findByDateQuery(_q).valueOf()).toEqual(
        {
          '$gte': 1569196800000,
          '$lte': 1571875200000
        })
    })
    it('toJSON', () => {
      expect(findByDateQuery(_q).toJSON()).toEqual(
        {
          '$gte': '2019-09-23T00:00:00.000Z',
          '$lte': '2019-10-24T00:00:00.000Z'
        })
    })
    it('toISOString', () => {
      expect(findByDateQuery(_q).toISOString()).toEqual(
        findByDateQuery(_q).toJSON())
    })
    it('toString', () => {
      expect(findByDateQuery(_q).toString()).toEqual(
        {
          '$gte': 'Mon, 23 Sep 2019 00:00:00 GMT',
          '$lte': 'Thu, 24 Oct 2019 00:00:00 GMT'
        })
    })
  })
})
