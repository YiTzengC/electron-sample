//import mongoose
const mongoose = require('mongoose')
//define schema
const schema = {
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}
//mongoose schema object
const participantSchema = new mongoose.Schema(schema)
//export mongoose model
module.exports = mongoose.model('Participant', participantSchema)