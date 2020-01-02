const MongoWrapper = require('..')
const settings = require('./settings')
let mongo
const testCollection = 'testCollection'
const data = [
  {
    _id: '5dca8367e24a29ef1d6e9b1b',
    name: 'Stone',
    gender: 'male'
  },
  {
    _id: '5dca83675df9e726cf592294',
    name: 'Montoya',
    gender: 'male'
  },
  {
    _id: '5dca8367f6d55113edee55b5',
    name: 'Cabrera',
    gender: 'male'
  },
  {
    _id: '5dca836712d0a7f62edf4cf2',
    name: 'Maxwell',
    gender: 'male'
  },
  {
    _id: '5dca8367519f3556f9d47a7d',
    name: 'Constance',
    gender: 'female'
  },
  {
    _id: '5dca836757b39657e16ea8fb',
    name: 'Holcomb',
    gender: 'male'
  }
]
beforeAll(async () => {
  mongo = new MongoWrapper(settings, testCollection)
  const res = await mongo.find({})
  if (res.length) {
    await mongo.drop()
  }
})
beforeEach(async () => {
  mongo = new MongoWrapper(settings, testCollection)
})
afterEach(async () => {
  await mongo.drop()
})
test('basic', async () => {
  // expect(mongo.url).toBe('mongodb://mongodb0.example.com:27017/admin')
  const insertResult = await mongo.insertMany([{ _id: 1 }, { _id: 3 }], {
    w: 1
  })
  expect(insertResult).toEqual({
    insertedCount: 2,
    insertedIds: {
      '0': 1,
      '1': 3
    },
    ops: [
      {
        _id: 1
      },
      {
        _id: 3
      }
    ],
    result: {
      n: 2,
      ok: 1
    }
  })
  const duplicateFunction = mongo.insertMany([{ _id: 1 }, { _id: 3 }])
  await expect(duplicateFunction).rejects.toThrow(
    /E11000 duplicate key error collection/
  )
  await mongo.updateMany(
    { _id: 1 },
    { $set: { _id: 1, name: 'alice' } },
    { upsert: true, w: 1 }
  )
  let res = await mongo.find({})
  expect(res).toEqual([{ _id: 1, name: 'alice' }, { _id: 3 }])
  await mongo.deleteOne({ _id: 1 })
  res = await mongo.find({})
  expect(res).toEqual([{ _id: 3 }])
  await mongo.deleteOne({ _id: 3 })
  res = await mongo.find({})
  expect(res).toEqual([])
})

test('agregate', async () => {
  await mongo.insertMany(data)
  const pipe = [{ $group: { _id: '$gender', count: { $sum: 1 } } }]
  const res = await mongo.aggregate(pipe)
  expect(res).toEqual([
    { _id: 'female', count: 1 },
    { _id: 'male', count: 5 }
  ])
})

test('bulk upsert', async () => {
  const bulkData = MongoWrapper.toBulkArray(data)
  expect(bulkData[0]).toEqual({
    updateOne: {
      filter: { _id: '5dca8367e24a29ef1d6e9b1b' },
      update: {
        _id: '5dca8367e24a29ef1d6e9b1b',
        gender: 'male',
        name: 'Stone'
      },
      upsert: true
    }
  })
  const res = await mongo.bulkWrite(bulkData)
  expect(res.nUpserted).toBe(6)
})
