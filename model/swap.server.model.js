// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creating the users schema
var Users = new Schema({
    firstName:{
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return (value.length > 2 && value.toLocaleLowerCase() !== 'none');
            },
            message: 'Name should be of 2 or more letters.'
        },
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    address1:{
        type: String,
        required: true,
    },
    address2:{
        type: String
    },
    city:{
        type: String,
        default:'Charlotte'
    },
    state:{
        type: String,
        default:'NC'
    },
    postCode:{
        type: String,
        default:'28262'
    },
    country:{
        type: String,
        default:'USA'
    },
    password:{
        type: String,
        required: true
    }
    
}, { collection: 'Users' });

//exporting the model
module.exports.UserModel = mongoose.model('Users', Users,'Users');


var Books = new Schema({
    bookName:{
        type: String,
        required: true
    },
    author:{
    type:String,
        required:true
    },
    catalogCategory:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    rating:{
        type:Number,
        default: 3
    },
    imageUrl:{
        type: String,
        default:'https://ibf.org/site_assets/img/placeholder-book-cover-default.png'
    },
    status:{
        type:String,
        default:'available'
    },
    swapItem : {
        type:String,
        default:'none'
    },
    swapItemRating: {
        type: Number,
        default: 0
    },
    genRating:{
        type:Number,
        default: 1
    },
    swapperRating:{
        type: Number,
        default: 0
    },
    userId:{
        type:String,
        required:true
    }
})

Books.statics.deleteBook = function(bookId){
    return new Promise((resolve, reject ) => {
        var query = this.deleteOne({"_id":bookId});
        query.then(docs =>{
            resolve(docs);
        }).catch(err =>{
            console.error(err);
            return reject(err);
        })
    })
};

Books.statics.getBook = function(bookId){
    return new Promise((resolve, reject) => {
        let query = this.find({_id:bookId});
        query.then(docs => {
            resolve(docs);
        }).catch(err =>{
            console.error(err);
            return reject(err);
        })
    })
};

Books.statics.updateStatus = function(bookId, status){
    return new Promise((resolve, reject) => {
        let query = this.findOneAndUpdate({_id:bookId},{"status": status});
        query.then(docs => {
            resolve(docs);
        }).catch(err =>{
            console.error(err);
            return reject(err);
        })
    })
};

//exporting the model
module.exports.ItemModel = mongoose.model('Books', Books);