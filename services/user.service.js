
const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SECRET || 'secret-puk-1234')



const gUsers = require('../data/user.json')

module.exports = {
  query,
  getById,
  remove,
  save,
  getLoginToken,
  checkLogin,
  validateToken
}

const PAGE_SIZE = 3

function query(filterBy = {}) {
  const regex = new RegExp(filterBy.userName, 'i')
  var users = gUsers.filter((user) => regex.test(user.userName))
  
  //pagination
  if(filterBy.page) {
    const startIdx = filterBy.page * PAGE_SIZE
    users = users.slice(startIdx, startIdx + PAGE_SIZE)
  }
  return Promise.resolve(users)
  // return Promise.resolve(gUsers)
}

function getById(userId) {
  const user = gUsers.find((user) => user._id === userId)
  if (!user) return Promise.reject('Unknown user')
  return Promise.resolve(user)
}

function remove(userId) {
  const idx = gUsers.findIndex((user) => user._id === userId)
  if (idx === -1) return Promise.reject('Unknown user')

  gUsers.splice(idx, 1)
  return _saveUsersToFile()
}

function save(user) {
  var savedUser
  if (user._id) {
    savedUser = gUsers.find((currUser) => currUser._id === user._id)
    if (!savedUser) return Promise.reject('Unknown user')
    savedUser.fullname = user.fullname
    savedUser.username = user.username
    savedUser.password = user.password
    savedUser.createdAt = user.createdAt
  } else {
    console.log('in else',user)
    savedUser = {
      _id: _makeId(),
      fullname : user.fullname,
      username : user.username,
      password : user.password,
      createdAt: Date.now(),
    }
    gUsers.push(savedUser)
  }

  return _saveUsersToFile().then(() => {
    const user = {
      _id: savedUser._id,
      fullname: savedUser.fullname
  }
  return user

  })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function checkLogin({ username, password }) {
  console.log('in user service', username, password);
  var user = gUsers.find(user => user.username === username && user.password === password)
  console.log(user);
  if (user) {
      user = {
          _id: user._id,
          fullname: user.fullname,
          isAdmin : user.isAdmin
      }
  }
  return Promise.resolve(user)
}

function validateToken(loginToken) {
  try {
      const json = cryptr.decrypt(loginToken)
      const loggedinUser = JSON.parse(json)
      return loggedinUser
  } catch (err) {
      console.log('Invalid login token')
  }
  return null
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gUsers, null, 2)

    fs.writeFile('data/user.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

