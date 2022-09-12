const User = require('./model')

function validateUser(req, res, next) {
  let { username, password } = req.body
  console.log(username, password)
  
  if(typeof username != 'string' || username.trim() == '' || password.trim() == '' || password == undefined || username == undefined) {
    res.status(404).json({ message: "username and password required"});
    return
  } else {
      req.newUser = { 
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