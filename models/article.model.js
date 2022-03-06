const mongosse = require('mongoose');


const articleSchema = mongosse.Schema({
    title: {type: String, required:true},
    category: {type: String, required:true},
    content: {type: String, required:true},
    image: {type: String, required:true},
    author:{
        type: mongosse.Schema.Types.ObjectId,
        ref: 'User'
    },
    publishedAt: {type: Date, required:true},
});


module.exports = mongosse.model('Article', articleSchema);