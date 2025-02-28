const router = require('express').Router();
const User = require('./model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateUser, uniqueUser } = require('./middleware')

const { JWT_SECRET } = require('../../config/index')

router.post('/register', validateUser, uniqueUser, async (req, res, next) => {
  try{
    const { username, password } = req.newUser //grabbing username and password from middleware

    let hash = bcrypt.hashSync(password, 6) //hashing the password

    await User.add({username, password: hash}) //Adding the information to the database
    .then(result => {
      const id = result.id
      return res.status(201).send({
        id: id,
        username: result.username,
        password: result.password
      })
    })
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

router.post('/login', validateUser, (req, res, next) => {
  // res.end('implement login, please!');

    let { username, password } = req.newUser
    User.findBy({ username })
      .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)){
          const token = buildToken(user)
          return res.status(200).json({
            message: `welcome, ${username}`,
            token
          })
        } else {
          res.status(401).json({message: 'invalid credentials'})
        }
    }
    )

    function buildToken(user) {
      const payload = {
        subject: user.id,
        username: user.username,
      }
      const option = {
        expiresIn: '1h',
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
