//import mongoose
const mongoose = require('mongoose')
//define schema
const schema = {
    date: {
        type: Date,
        required: true
    },
    initiatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    location: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true
    }
}
//mongoose schema object
const eventSchema = new mongoose.Schema(schema)
//export mongoose model
module.exports = mongoose.model('Event', eventSchema)