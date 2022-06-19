const mongoose = require('mongoose')
const goalSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, 'key is "text" and value pair is "string". please follow this schema']
    }
},
{
    timestamps: true
})
module.exports = mongoose.model('Goal', goalSchema)