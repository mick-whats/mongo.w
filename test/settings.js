/**
db.createUser({user:"mick",pwd:"testPass",roles:[{ role:"readWrite", db:"test" }]})
db.grantRolesToUser("mick", [{role: "dbAdmin", db: "test"}])
*/
module.exports = {
  user: 'mick',
  pass: 'testPass',
  dbName: 'test'
}
