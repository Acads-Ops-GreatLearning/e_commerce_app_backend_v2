const mongoose = require('mongoose');
const { default: UserModel } = require('./userModel');

const userSessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sessionToken: {
        type: String,
        default: null
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    createdTs: {
        type: Date,
        default: new Date(),
    },
    updatedTs: {
        type: Date,
        default: new Date(),
    }
});

const UserSessionModel = mongoose.model('UserSessionModel', userSessionSchema);

module.exports = UserSessionModel;