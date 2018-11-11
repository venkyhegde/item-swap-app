
var async = require('async');
var SwapModel = require('../model/swap.server.model');
var OfferModel = require('../model/offer.model');

exports.categories = function (req, res, next) {
    var self = this;
    console.log('Profile contoller - categories--received');
    // check if the user is logged in
    let loginFlag = req.session.loginFlag;
    let data = {};
    data.title = 'Categories';
    // get all the items categories
    var query = SwapModel.ItemModel.distinct('catalogCategory');
    query.then(function (docs) {
        data.items= docs;
        console.log(data.items);
        data.loginFlag = req.session.loginFlag;
        getTenAllAvailableItems.then(function (books) {
            data.additinalItems = books;
            allAvailableItems = data.additinalItems;
            console.log("DATA-"+JSON.stringify(allAvailableItems));
            if(req.session.loginFlag){
                data.docs = req.session.theUser;
                data.loginFlag = req.session.loginFlag;
                data.theUser = req.session.theUser;
                res.render('categories', {data: data});
            } else {
                res.render('categories', {data: data});
            }
            
        }).catch(function (err) {
            console.log(err);
        })
        
    }).catch(function (err) {
        console.log(err);
    });
}

exports.getCatalogItems = function (req, res, next) {
    console.log('Catalog controller - getCatalogItems');
    let categoryName = req.params.categoryName.trim();
    let loginFlag = req.session.loginFlag;
    let data = {};
    data.title = categoryName.charAt(0).toLocaleUpperCase() + categoryName.slice(1)+' - Category';
    
    if(loginFlag){
        //TODO: if the user is logged in don't show user books
        data.docs = req.session.theUser;
        data.loginFlag = loginFlag;
        data.theUser = req.session.theUser;
        let userId = data.theUser._id;
        data.categoryName = categoryName;
        var query = SwapModel.ItemModel.find({"catalogCategory":categoryName, userId:{$ne:userId}});
        query.then(function (docs) {
            data.items = docs;
            res.render('category',{data:data});
        }).catch(function (err) {
            console.log(err)
        })
    } else{
        // if user is not logged in show all items
        var query = SwapModel.ItemModel.find({"catalogCategory":categoryName});
        query.then(function (docs) {
            data.items = docs;
            data.categoryName = categoryName;
            res.render('category', {data: data});
        }).catch(function (err) {
            console.log(err);
        })
    }
}

exports.getItem = function(req, res, next){
    let _id = req.params._id.trim();
    console.log("Catalog controller - getItem"+_id);
    
    let data = {};
    
    var query = SwapModel.ItemModel.find({"_id":_id});
    query.then(function (docs) {
        data.title = docs.bookName;
        data.items = docs;
        console.log(data.items);
      
        if(req.session.loginFlag){
            data.docs = req.session.theUser;
            data.loginFlag = req.session.loginFlag;
            data.theUser = req.session.theUser;
            res.render('item',{data: data});
        } else{
            data.loginFlag = false;
            res.render('item',{data: data});
        }
    }).catch(function (err) {
        console.log(err)
    })
}

var getTenAllAvailableItems = new Promise(function (resolve, reject) {
    var query = SwapModel.ItemModel.find({"status":"available"}).select({"bookName":1, "imageUrl":1, "catalogCategory":1}).limit(10);
    query.then(function (docs) {
        console.log("From promise-");
        console.log(docs);
        resolve(docs);
    }).catch(function (err) {
        reject(err);
    })
});


exports.swapIt = function(req, res, next) {
    console.info('Catalog controller- swapIt');
    var data = {};
    data.book = {};
    data.book.bookId = req.body.bookId;
    data.book.bookName = req.body.bookName;
    data.book.author = req.body.author;
    data.book.status = req.body.status;
    data.book.userRating = req.body.userRating;
    data.book.categories = req.body.categories;
    data.book.imageUrl = req.body.imageUrl;
    data.book.itemUserId = req.body.itemUserId;
    let userId = req.session.theUser._id
    
    data.docs = req.session.theUser;
    data.loginFlag = req.session.loginFlag;
    data.theUser = req.session.theUser;
    
    console.log("The User"+userId);
    data.title = 'Swap - '+data.book.bookName;
    // get the user available book name and _id
    var query = SwapModel.ItemModel.find({"userId":userId, "status":{$eq:'available'}}).select({"bookName":1,"imageUrl":1});
    query.then(function (docs) {
        console.info('Catalog controller- swapIt_'+docs+'_'+JSON.stringify(data.book));
        data.items = docs;
        res.render('swap',{data:data});
    })
    
    
    
}

exports.confirmSwap = function (req, res, next) {
    
    let data = {};
    data.title = 'Swap Success!';
    console.info("Catalog controller - confirmSwap()");
    let itemCodeOwn = req.body.itemCodeOwn;
    let itemCodeWant = req.body.itemCodeWant;
    let itemUserId = req.body.itemUserId;
    let status = 'pending';
    let userId = req.session.theUser._id;
    console.log("------------------------------------");
    console.log("itemCodeOwn"+itemCodeOwn);
    console.log("itemCodeWant"+itemCodeWant);
    console.log("itemUserId"+itemUserId);
    
    console.log("------------------------------------");
    console.log('Catalog controller - ');
    console.log('Item code own - '+itemCodeOwn);
    console.log('Item code want - '+itemCodeWant);
    //update the user book
    SwapModel.ItemModel.findOneAndUpdate({"_id":itemCodeOwn},{"status":"pending"},{new:true}).then(docs => {
        console.log(docs);
        data.userItem = docs;
        SwapModel.ItemModel.findOneAndUpdate({"_id": itemCodeWant},{"status":"pending"},{new:true}).then(result => {
            data.otherItem = result;
            OfferModel.addOffer(userId,itemCodeOwn,itemCodeWant,itemUserId,status).then(docs => {
                data.docs = req.session.theUser;
                data.loginFlag = req.session.loginFlag;
                data.theUser = req.session.theUser;
                
                res.render('confirmSwap', {data:data});
            }).catch(err =>{
                console.error(err);
            })
            
        })
    }).catch(err => {
    console.log(err);
    })
};


exports.updateGeneralRating = function (req, res, next, bookId) {
    console.info('Catalog controller - updateGeneralRating');
    let data = {
    
    };
    // get and process rating
    let genRating = getRating(req);
    
    SwapModel.ItemModel.findOneAndUpdate({"_id":bookId},{"genRating": genRating}).then(docs => {
        // assign data and render updated item page
        SwapModel.ItemModel.find({"_id":docs._id}).then(docs =>{
            data.title = docs.bookName;
            data.items = docs;
            console.log(data.items);
            data.docs = req.session.theUser;
            data.loginFlag = req.session.loginFlag;
            data.theUser = req.session.theUser;
            res.render('item',{data: data});
        })
    }).catch(err =>{
        console.error(err);
    })
    
};


/**
 * Returns the rating
 * @param req
 * @returns {number}
 */
function getRating(req) {
    let totalRating = 5;
    let newRating = 0;
    let currentRating = req.body.currentGenRating;
    let ratingArray = [req.body.one, req.body.two, req.body.three, req.body.four, req.body.five];
    console.log("From Rating"+ratingArray);
    for(let i=0; i < ratingArray.length; i++) {
        if(undefined === ratingArray[i]){
            continue;
        } else{
            newRating = newRating + 1;
        }
    }
    console.log(newRating);
    
    let ratingPercentage = (newRating / totalRating ) * 100;
   let rating = ( ratingPercentage / 100) * 5;
   console.log(rating);
    rating = Math.round(rating);
    console.log(rating);
    
    return rating;
    
}