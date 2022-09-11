const db = require('../../data/dbConfig')

function find(username){
  return db('users').where({ username }).first()
}

function findBy(filter){
  return db('users').select('username', 'password', 'id').where(filter)
}

function getById(id){
  return db('users').where('id', id).first()
}

async function add(user){
  const [id] = await db('users').insert(user)
  return getById(id)
}

module.exports = {
  find,
  findBy,
  getById,
  add
}