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
