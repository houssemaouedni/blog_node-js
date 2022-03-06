const mongosse = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const resetSchema = mongosse.Schema({
    username: {type: String, required:true},
    resetPasswordToken:{type: String, required:true},
    resetExpires: {type: Number, required:true},
    createdAt: {type: Date, default: Date.now()},
});

resetSchema.plugin(passportLocalMongoose);



module.exports = mongosse.model('Reset', resetSchema);