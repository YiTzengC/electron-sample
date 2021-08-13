//import mongoose
const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')
//define schema
const schema = {
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'profile.png'
    }
}
//mongoose schema object
const userSchema = new mongoose.Schema(schema)

//configure schema with passport authentication
userSchema.plugin(plm)

//export mongoose model
module.exports = mongoose.model('User', userSchema)