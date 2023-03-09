const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const port = 3030
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

//Bug Rest API

app.get('/api/bug', (req, res) => {
  const sortBy = {
      by: req.query.by || 'title',
      desc: +req.query.desc || 1
  }

  const filterBy = {
      title: req.query.title || '',
      page: +req.query.page || 0,
      createdAt: req.query.createdAt || 1,
      severity: req.query.severity || 1,
      labels: req.query.labels || null
  }


  bugService.query(filterBy, sortBy)
      .then(results => {
          res.send(results)
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot load bugs')
      })
})

app.put('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const { _id, title, severity, description } = req.body
  const bug = { _id, title, severity, description }
  bugService.save(bug)
      .then(savedBug => {
          res.send(savedBug)
      })
      .catch(err => {
          console.log('Cannot save bug, Error:', err)
          res.status(400).send('Cannot save bug')
      })
})

app.post('/api/bug', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const { title, severity, description } = req.body
  const bug = { title, severity, description }
  bugService.save(bug, loggedinUser)
      .then(savedBug => {
          res.send(savedBug)
      })
      .catch(err => {
          console.log('Cannot save bug, Error:', err)
          res.status(400).send('Cannot save bug')
      })
})

app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  var visitedBugIds = req.cookies.visitedBugIds || []
  console.log('visitedBugIds', visitedBugIds)
  if (visitedBugIds >= 3) return res.status(401).send('wait for a bit')
  if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
  res.cookie('visitedBugIds', visitedBugIds, { maxAge: 7000 })
  bugService.getById(bugId)
      .then(bug => {
          res.send(bug)
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot load bug')
      })
})

app.delete('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')

  const { bugId } = req.params
  bugService.remove(bugId, loggedinUser)
      .then(() => {
          res.send('Bug Deleted')
      })
      .catch((err) => {
          console.log('Error:', err)
          res.status(400).send('Cannot remove bug')
      })
})


// Users Rest API
app.get('/api/user', (req, res) => {
  const filterBy = {}
  
  userService.query(filterBy)
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      console.log('Error', err)
      res.status(400).send('Cannot save user')
    })
})

app.put('/api/user/:userId', (req, res) => {
  const { _id, userName, fullName, password } = req.body
  const user = {
    _id,
    userName,
    fullName,
    password,
  }

  userService.save(user)
    .then((savedUser) => {
      res.send(savedUser)
    })
    .catch((err) => {
      console.log('Error', err)
      res.status(400).send('Cannot save user')
    })
})

app.post('/api/user', (req, res) => {
  const { userName, fullName, password } = req.body
  const user = {
    userName,
    fullName,
    password,
  }

  userService
    .save(user)
    .then((savedBug) => {
      res.send(savedBug)
    })
    .catch((err) => {
      console.log('Error', err)
      res.status(400).send('Cannot save user')
    })
})

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params

   userService.getById(userId)
    .then((user) => {
      res.send(user)
    })
    .catch((err) => {
      console.log('Error', err)
      res.status(400).send('Cannot load user')
    })
})

app.delete('/api/user/:userId', (req, res) => {
  const { userId } = req.params
  userService
    .remove(userId)
    .then(() => {
      res.send('user deleted')
    })
    .catch((err) => {
      console.log('Error', err)
      res.status(400).send('Cannot remove user')
    })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body
  console.log(credentials);

  userService.checkLogin(credentials)
      .then(user => {
          if (user) {
              const loginToken = userService.getLoginToken(user)
              res.cookie('loginToken', loginToken)
              res.send(user)
          } else {
              res.status(401).send('Invalid Credentials')
          }
      })
})

app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body
  console.log(credentials);

  userService.save(credentials)
      .then(user => {
          if (user) {
              const loginToken = userService.getLoginToken(user)
              res.cookie('loginToken', loginToken)
              res.send(user)
          } else {
              res.status(401).send('Invalid Credentials')
          }
      })
})


app.listen(port, () => {
  console.log(`BugApp app listening on: http://localhost:${port}`)
})
