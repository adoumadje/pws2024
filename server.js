const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const uuid = require('uuid')
const expressSession = require('express-session')
const passport = require('passport')
const passportJson = require('passport-json')

let config = {
    port: 8000,
    frontend: './pws2024-vue/dist'
}

try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
    console.log('Configuration from config.json')
} catch(err) {
    console.log('Using default configuration')
}

// my own module
const auth = require('./auth')
const person = require('./person')
const project = require('./project')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

// initialize mechanisms of sessions handling and authorization
app.use(expressSession({ secret: config.dbUrl, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportJson.Strategy(auth.checkCredentials))
passport.serializeUser(auth.serialize)
passport.deserializeUser(auth.deserialize)

app.use(express.static(config.frontend))

// authentication endpoints
const authEndpoint = '/api/auth'

app.get(authEndpoint, auth.whoami)
app.post(authEndpoint, passport.authenticate('json', { failWithError: true }), auth.login, auth.errorHandler)
app.delete(authEndpoint, auth.logout)

// Person Endpoints
app.get(person.endpoint, auth.checkIfInRole([0,1]), person.get)
app.post(person.endpoint, auth.checkIfInRole([0]), person.post)
app.put(person.endpoint, auth.checkIfInRole([0]), person.put)
app.delete(person.endpoint, auth.checkIfInRole([0]), person.delete)

// Project Endpoints
app.get(project.endpoint, project.get)
app.post(project.endpoint, auth.checkIfInRole([0]), project.post)
app.put(project.endpoint, auth.checkIfInRole([0]), project.put)
app.delete(project.endpoint, auth.checkIfInRole([0]), project.delete)

// database connection
mongoose.connect(config.dbUrl)
.then((conn) => {
    console.log(`Connection to ${config.dbUrl} established`)

    person.init(conn)
    project.init(conn)
})
.catch((err) => {
    console.error(`Connection to ${config.dbUrl} failed`)
    process.exit(0)
})

// start server
app.listen(config.port, () => {
    console.log('Backend listening on port', config.port)
})