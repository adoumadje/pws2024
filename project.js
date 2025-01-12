const mongoose = require('mongoose')
const uuid = require('uuid')

module.exports = {
    schema: null,
    model: null,
    endpoint: '/api/project',

    init: conn => {
        this.schema = new mongoose.Schema({
            _id: { type: String, default: uuid.v4 },
            name: { type: String, required: true, validate: {
                validator: (v) => {
                    return /^\p{L}/u.test(v)
                },
                message: (props) => `${props.value} does not start from a letter`
            } },
            startDate: { type: Date, required: true, transform: (v) => v.toISOString().substr(0, 10) },
            endDate: { type: Date, required: true, transform: (v) => v.toISOString().substr(0, 10) },
            contractor_ids: { type: [String], required: false, default: [] }
        },
        {
            versionKey: false,
            additionalProperties: false
        })
        this.model = conn.model('Project', this.schema)
    },

    get: (req, res) => {
        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = +req.query.order || 1
        }
        const matching = {
            $match: {name: { $regex: req.query.search || '', $options: 'i' }}
        }
    
        const aggregation = [matching]
    
        if(req.query.sort) {
            aggregation.push({ $sort: sort})
        }
        aggregation.push({ $skip: +req.query.skip || 0 })
        let limit = +req.query.limit
        if(!isNaN(limit) && limit > 0) {
            aggregation.push({ $limit: limit})
        }
    
        this.model.aggregate([{ $facet: {
            total: [ matching, { $count: 'count'} ],
            data: aggregation
        }}])
        .then(facet => {
            [facet] = facet
            facet.total = ( facet.total && facet.total[0] ? facet.total.count : 0) || 0
            facet.data = facet.data.map(project => new this.model(project))
            res.json(facet)
        })
    },

    post: (req, res) => {
        let project = new this.model(req.body)
        let err = project.validateSync()
        if(err) {
            res.status(400).json({ error: err.message })
            return
        }
        project.save()
        .then(() => res.status(201).json(project))
        .catch(err => res.status(400).json({ error: err.message }))
    },

    put: (req, res) => {
        let _id = req.body._id
        if(!_id) {
            res.status(400).json({ error: 'no _id!'})
            return
        }
        delete req.body._id
        this.model.findOneAndUpdate({_id}, { $set: req.body }, { new: true, runValidators: true })
        .then((row) => {
            res.json(row)
        })
        .catch((err) => {
            res.status(400).json({ error: err.message })
        })
    },

    delete: (req, res) => {
        let _id = req.body._id
        if(!_id) {
            res.status(400).json({ error: 'no _id!'})
            return
        }
        this.model.findOneAndDelete({_id})
        .then((row) => {
            res.json(row)
        })
        .catch((err) => {
            res.status(400).json({ error: err.message })
        })
    }
}