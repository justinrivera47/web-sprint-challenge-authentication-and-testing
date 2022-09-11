const router = require('express').Router();
const User = require('./model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../../config/index')

router.post('/register', async (req, res, next) => {
  // res.end('implement register, please!');
try{
  const { username, password } = req.body

  console.log('first ', username)
  
  if(typeof username != 'string' || username.trim() == '') {
    res.status(404).json({ message: "username and password required"});
    return
  }
  User.find(username)
    .then((result) => {
      if(result != null){
        res.status(404).json({ message: "username taken"})
        return
  }});
  let hash = bcrypt.hashSync(password, 6)
  await User.add({username, password: hash})

  res.status(201).send({ message: `Welcome, ${username}` })
} catch(err) {
  next(err)
}


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res, next) => {
  // res.end('implement login, please!');

    let { username, password } = req.body

    
    User.findBy({ username })
    .then(([user]) => {
      if(!username || !password) {
        res.status(404).json({ message: "username and password required"});
        return
      }
      if(user && bcrypt.compareSync(password, user.password)){
        const token = buildToken(user)
        return res.status(200).json({
          message: `welcome, ${username}`,
          token
        })
      } else {
        next({ status: 401, message: "invalid credentials"})
      }
    }
    )

    function buildToken(user) {
      const payload = {
        subject: user.id,
        username: user.username,
      }
      const option = {
        expiresIn: '1d',
      }
      return jwt.sign(payload, JWT_SECRET, option)
    }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});


module.exports = router;
