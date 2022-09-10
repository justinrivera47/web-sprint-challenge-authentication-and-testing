const db = require('../../data/dbConfig')

async function findBy(filter){
  await db('users').select('username').where('username', filter)
}

function getById(id){
  return db('users').where('id', id).first()
}

async function add(user){
  const [id] = await db('users').insert(user)
  return getById(id)
}

module.exports = {
  findBy,
  getById,
  add
}