const mongosse = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = mongosse.Schema({
    username: {type: String, required:true},
    firstname: {type: String, required:true},
    lastname: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String},
    createdAt: {type: Date, default: Date.now()},
});

userSchema.plugin(passportLocalMongoose);



module.exports = mongosse.model('User', userSchema);