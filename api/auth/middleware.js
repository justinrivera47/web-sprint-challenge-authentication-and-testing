const User = require('./model')

const validateUser = (req, res, next) => {
  const { username, password } = req.body
  
  if(username.trim() == '' || password.trim() == '' || password == undefined || username == undefined || !username || !password) {
    return res.status(404).json({ message: "username and password required"})
  } else {
      req.newUser = {
        name: 'justin',
        username: username.trim(),
        password: password.trim()
      }
      next()
  }
}

function uniqueUser(req, res, next) {
  User.find(req.newUser.username)
    .then((result) => {
      if(result != null){
        res.status(404).json({ message: "username taken"})
        return
      }
      next()
    })
}

module.exports = {
  validateUser,
  uniqueUser
}