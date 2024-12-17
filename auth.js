const crypto = require('crypto')
const mongoose = require('mongoose')
const uuid = require('uuid')

const User = new mongoose.model('User', new mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [Number] }
}, { versionKey: false }))

const makeHash = (password) => {
    return crypto.createHash('sha256').update(password).digest('base64')
}

const getIntersection = (arr1, arr2) => {
    const lookupSet = new Set(arr1)
    return arr2.filter((el) => lookupSet.has(el))
}

// create user 'admin' if it does not exist
User.findOne({username: 'admin'})
.then((user) => {
    if(!user) {
        const admin = new User({username: 'admin', password: makeHash('admin'), roles: [0]})
        admin.save()
    }
})
.catch((err) => {})

// create user 'user' if it does not exist
User.findOne({username: 'user'})
.then((res) => {
    if(!res) {
        const user = new User({username: 'user', password: makeHash('user'), roles: [1]})
        user.save()
    }
})
.catch(err => {})

const auth = module.exports = {
    makeHash,

    checkCredentials: (username, password, nextTick) => {
        User.findOne({ username, password: auth.makeHash(password) })
        .then((user) => nextTick(null, user || false))
        .catch(err => nextTick(null, false))
    },

    checkIfInRole: (roleNums) => (req, res, nextTick) => {
        let intersection = getIntersection(roleNums || [], req.user ? (req.user.roles || []) : [])
        if(!req.isAuthenticated()) {
            res.status(401).json({ error: 'Unauthorized' })
        } else if(intersection.length > 0) {
            return nextTick()
        } else {
            res.status(403).json({ error: 'Permission denied'})
        }
    },

    serialize: (user, nextTick) => nextTick(null, user.username),

    deserialize: (username, nextTick) => {
        User.findOne({username})
        .then((user) => {
            if(user) {
                return nextTick(null, user)
            } else {
                return nextTick(new Error('No such user'), null)
            }
        })
        .catch((err) => ({ error: err.message }))
    },

    whoami: (req, res) => {
        req.session.roles = req.user ? req.user.roles : []
        req.session.save()
        let data = { sessionid: req.session.id }
        if(req.user) {
            data.username = req.user.username
            data.roles = req.user.roles
        }
        res.json(data)
    },

    login: (req, res) => auth.whoami(req, res),

    logout: (req, res) => req.logout(() => auth.whoami(req, res)),

    errorHandler: (err, req, res, nextTick) => res.status(401).json({ error: err.message }),

    getUsers: (nextTick) => {
        User.find()
        .then((users) => {
            users.foreach((user) => {
                delete user._id
                user.password = user.password ? 1 : 0
            })
            nextTick(null, users)
        })
        .catch((err) => nextTick(err, null))
    } 
}