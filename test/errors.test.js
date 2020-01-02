const MongoWrapper = require('..')
it('sets.dbName is Required', () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new MongoWrapper({}, 'sample')
  }).toThrow('sets.dbName is Required')
})
it('mongo timeout', async () => {
  jest.setTimeout(35000)
  const a = new MongoWrapper({ dbName: 'test' }, 'sample')
  try {
    await a.find({})
  } catch (error) {
    expect(error.toString()).toMatch(/MongoTimeoutError/)
  }
})
