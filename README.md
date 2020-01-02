# monwrap

> It wraps all Methods of mongodb collection api.

[![Build Status](https://travis-ci.org/mick-whats/mongo.w.svg?branch=master)](https://travis-ci.org/mick-whats/mongo.w)

The official MongoDB driver is multi-functional.
However, "close db" or "requires toArray () when finding" is troublesome.
This wrapper simplifies them.

## Install

```
$ npm install monwrap
```


## Usage

```js
const MongoWrapper = require('monwrap')
const settings = {
  user: 'username',
  pass: 'password',
  dbName: 'database_name'
}
const mongo = new MongoWrapper(settings, 'collectionName')
await mongo.insertMany([{ _id: 1 }, { _id: 3 }], {w: 1})
const items = await mongo.find({})
```

## API

[node-mongodb-native Class: Collection](http://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html#drop)

## static API
### toBulkArray(array, idName = '_id')

```js
const MongoWrapper = require('monwrap')
const data = [{ _id: 1, a: 11 }]
MongoWrapper.toBulkArray(data)
/* ->
[
  {
    'updateOne': {
      'filter': { '_id': 1 },
      'update': { '_id': 1, 'a': 11 },
      'upsert': true
    }
  }
]
*/

const data = [{ x: 1, a: 11 }]
MongoWrapper.toBulkArray(data, 'x')
/* ->
[
  {
    'updateOne': {
      'filter': { '_id': 1 },
      'update': { '_id': 1, 'a': 11, x: 1 },
      'upsert': true
    }
  }
]
*/
```

## Related
[mongodb](https://www.npmjs.com/package/mongodb) The official MongoDB driver for Node.js. Provides a high-level API on top of mongodb-core that is meant for end users.


## License

MIT © [Mick Whats](https://github.com/mick-whats)
