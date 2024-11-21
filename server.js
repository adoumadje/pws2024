const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const uuid = require('uuid')

const config = {
    port: 8000,
    frontend: './pws2024-vue/dist'
}

try {
    config = JSON.parse(fs.readFileSync('config.json'))
    console.log('Configuration from config.json')
} catch(err) {
    console.log('Using default configuration')
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.use(express.static(config.frontend))

const personSchema = new mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    firstName: { type: String, required: true, validate: {
        validator: (v) => {
            return /^[A-Z]/.test(v)
        },
        message: (props) => `${props.value} does not start from capital`
    } },
    lastName: { type: String, required: true, validate: {
        validator: (v) => {
            return /^[A-Za-z]/.test(v)
        },
        message: (props) => `${props.value} does not start from a letter`
    }},
    birthDate: { type: Date, required: true, transform: (v) => v.toISOString().substr(0, 10) }
},
{
    versionKey: false,
    additionalProperties: false
})

app.post('/api', (req, res) => {
    console.log(req.body);
    
    res.json({ test: true })
})

app.listen(config.port, () => {
    console.log('Backend listening on port', config.port)
})