const mongodb = require('mongodb')
const collectionMethodList = require('./collectionMethodList')

// eslint-disable-next-line jsdoc/require-example
/**
 * classにMethodを登録する。
 * collectionMethodListの項目はmongodb.collectionのMethodと同名になっており、それらを登録する。
 *
 * @private
 * @param {Array} args - インスタンス使用時に与えられる引数とMethod名
 * @returns {Object} - それぞれのMethodに適した返り値
 */
async function _exec (args) {
  const _methodName = args.pop()
  let res
  let client
  try {
    client = await mongodb.MongoClient.connect(this.url, {
      useNewUrlParser: true
    }).catch((e) => { throw e })
    const db = await client.db(this.dbName)
    const col = db.collection(this.collectionName)
    res = await col[_methodName](...args)
    if (
      res.constructor.name === 'Cursor' ||
      res.constructor.name === 'AggregationCursor'
    ) {
      res = await res.toArray()
    }
  } catch (error) {
    throw error
  } finally {
    if (client) {
      client.close()
    }
  }
  return res
}
/**
 * objectをパラメータ文字列に変換する
 *
 * @param {Object} obj - 変換元のobject
 * @returns {string} - paramString
 * @example
 * const s = objectToParamString({a:1, b:2})
 * // a=1&b=2
 */
function objectToParamString (obj) {
  return Object.keys(obj)
    .map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
    })
    .join('&')
}
class MongoWrapper {
  /**
   *Creates an instance of MongoWrapper.
   *
   * @param {*} sets - mongo settings
   * @param {*} _collectionName - use collection name
   * @memberof MongoWrapper
   * @example
   * const MongoWrapper = require('mongo.w')
   * const settings = {
   *   user: 'username',
   *   pass: 'password',
   *   dbName: 'database_name'
   * }
   * const mongo = new MongoWrapper(settings'collectionName')
   * await mongo.insertMany([{ _id: 1 }, { _id: 3 }], {w: 1})
   * const items = await mongo.find({})
   */
  constructor (sets, _collectionName) {
    if (!sets || !sets.dbName) {
      throw new Error('sets.dbName is Required')
    }
    const {
      url,
      port = 27017,
      host = 'localhost',
      user,
      pass,
      dbName,
      options = {
        authMechanism: 'DEFAULT',
        useUnifiedTopology: true
      }
    } = sets
    const auth =
      user && pass
        ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@`
        : ''
    this.dbName = dbName
    this.collectionName = _collectionName
    const _params = objectToParamString(options)
    const params = _params ? '?' + _params : ''

    this.url = url || `mongodb://${auth}${host}:${port}${params}`
    // method登録
    collectionMethodList.forEach(methodName => {
      this[methodName] = async (...args) => {
        args.push(methodName)
        const result = await _exec.call(this, args)
        return result
      }
    })
  }
  /**
   * 配列をbulkWriteで使用できる形式に加工する
   *
   * @static
   * @param {Object[]} arr - 加工前の配列
   * @param {string} [idName='_id'] - _idに使用するパラメータ名
   * @returns {Object[]} 加工後の配列
   * @example
   * const bulkData = MongoWrapper.toBulkArray(data)
   * const mongo = new MongoWrapper(settings, collectionName)
   * const res = await mongo.bulkWrite(bulkData)
   * @memberof MongoWrapper
   */
  static toBulkArray (arr, idName = '_id') {
    if (!Array.isArray(arr)) {
      throw new Error('must be an array')
    }
    return arr.map(o => {
      if (!o[idName]) {
        throw new ValidationError(
          `${idName} property does not exist: ${JSON.stringify(o)}`
        )
      }
      o._id = o[idName]
      return {
        updateOne: {
          filter: { _id: o._id },
          update: o,
          upsert: true
        }
      }
    })
  }
}
class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
  }
}
module.exports = MongoWrapper
