const MongoWrapper = require('..')
let mongo

describe('url test', () => {
  test('If host is not set, it will be localhost', () => {
    const url = 'mongodb://localhost:27017'
    const opts = {
      dbName: 'admin',
      options: {}
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
  test('For a standalone', () => {
    const url = 'mongodb://mongodb0.example.com:12345'
    const opts = {
      host: 'mongodb0.example.com',
      port: 12345,
      dbName: 'admin',
      options: {}
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
  test('For a standalone with url', () => {
    const url = 'mongodb://mongodb0.example.com:27017'
    const opts = {
      url,
      host: 'localhost', // urlの設定がある場合、他の項目は無視される
      dbName: 'admin',
      options: {}
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
  test('For a standalone with Authentication', () => {
    // userとpassを両方設定しているとbasic認証入りのurlになる
    const url = 'mongodb://user1:pass1@localhost:27017'
    const opts = {
      user: 'user1',
      pass: 'pass1',
      dbName: 'admin',
      options: {}
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
  test('For a standalone with params', () => {
    const url = 'mongodb://mongodb0.example.com:27017?authMechanism=DEFAULT'
    const opts = {
      host: 'mongodb0.example.com',
      dbName: 'admin',
      options: { authMechanism: 'DEFAULT' }
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
  test('For a standalone with default params', () => {
    // optionsを設定しないと自動的にオプションが付与される
    // optionを設定したくないときは空のobjectを渡す -> {}
    const url =
      'mongodb://mongodb0.example.com:27017?authMechanism=DEFAULT&useUnifiedTopology=true'
    const opts = {
      host: 'mongodb0.example.com',
      dbName: 'admin'
    }
    mongo = new MongoWrapper(opts, 'xxx')
    expect(mongo.url).toEqual(url)
  })
})
// https://docs.mongodb.com/manual/reference/connection-string/

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
