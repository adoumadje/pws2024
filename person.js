const mongoose = require('mongoose')
const uuid = require('uuid')

const project = require('./project')
const task = require('./task')

const person = module.exports = {
    schema: null,
    model: null,
    endpoint: '/api/person',

    init: conn => {
        person.schema = new mongoose.Schema({
            _id: { type: String, default: uuid.v4 },
            firstName: { type: String, required: true, validate: {
                validator: (v) => {
                    return /^\p{L}/u.test(v)
                },
                message: (props) => `${props.value} does not start from a letter`
            } },
            lastName: { type: String, required: true, validate: {
                validator: (v) => {
                    return /^\p{L}/u.test(v)
                },
                message: (props) => `${props.value} does not start from a letter`
            }},
            birthDate: { type: Date, required: true, transform: (v) => v.toISOString().substr(0, 10) }
        },
        {
            versionKey: false,
            additionalProperties: false
        })
        person.model = conn.model('Person', person.schema)
    },

    get: (req, res) => {
        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = +req.query.order || 1
        }
        const minprojects = +req.query.minprojects || 0
        const matching = [
            { $lookup: { from: 'projects', localField: '_id', foreignField: 'contractor_ids', as: 'projects' } },
            { $set: { project_ids: { $map: { input: '$projects', as: 'item', in: '$$item._id' } } } },
            { $unset: 'projects' },
            { $lookup: { from: 'tasks', localField: '_id', foreignField: 'contractor_ids', as: 'tasks' } },
            { $set: { task_ids: { $map: { input: '$tasks', as: 'item', in: '$$item._id' } } } },
            { $unset: 'tasks' },
            { $match: {
                    $and: [
                        { $or: [
                                {firstName: { $regex: req.query.search || '', $options: 'i' }},
                                { lastName: { $regex: req.query.search || '', $options: 'i'}}
                        ]},
                        { $expr: { $gte: [{ $size: '$project_ids' }, minprojects] }},
                        ...(req.query.project_id ? [{ project_ids: { $in: [req.query.project_id] } }] : [])
                    ]
                }
            }
        ]
    
        const aggregation = [...matching]
    
        if(req.query.sort) {
            aggregation.push({ $sort: sort})
        }
        aggregation.push({ $skip: +req.query.skip || 0 })
        let limit = +req.query.limit
        if(!isNaN(limit) && limit > 0) {
            aggregation.push({ $limit: limit})
        }
    
        person.model.aggregate([{ $facet: {
            total: [ ...matching, { $count: 'count'} ],
            data: aggregation
        }}])
        .then(facet => {
            [facet] = facet
            facet.total = ( facet.total && facet.total[0] ? facet.total[0].count : 0) || 0
            facet.data = facet.data.map(item => {
                const newItem = new person.model(item).toObject()
                newItem.project_ids = item.project_ids
                newItem.task_ids = item.task_ids
                return newItem
            })
            res.json(facet)
        })
        .catch(err => res.status(400).json({error: err.message}))
    },

    post: (req, res) => {
        let item = new person.model(req.body)
        let err = item.validateSync()
        if(err) {
            res.status(400).json({ error: err.message })
            return
        }
        item.save()
        .then((row) => {
            res.json(row)
        })
        .catch((err) => {
            res.status(400).json({ error: err.message })
        })
    },

    put: (req, res) => {
        let _id = req.body._id
        if(!_id) {
            res.status(400).json({ error: 'no _id!'})
            return
        }
        delete req.body._id
        person.model.findOneAndUpdate({_id}, { $set: req.body }, { new: true, runValidators: true })
        .then((row) => {
            res.json(row)
        })
        .catch((err) => {
            res.status(400).json({ error: err.message })
        })
    },

    delete: (req, res) => {
        let _id = req.query._id
        if(!_id) {
            res.status(400).json({ error: 'no _id!'})
            return
        }
        person.model.findOneAndDelete({_id})
        .then((row) => {
            project.model.updateMany({contractor_ids: _id}, { $pull: { contractor_ids: _id }})
            .then(() => {
                task.model.updateMany({contractor_ids: _id}, { $pull: { contractor_ids: _id }})
                .then(() => {
                    res.json(row)
                })
                .catch((err) => {
                    res.status(400).json({ error: err.message })
                })
            })
            .catch((err) => {
                res.status(400).json({  error: err.message })
            })
        })
        .catch((err) => {
            res.status(400).json({ error: err.message })
        })
    }
}