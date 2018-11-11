var SwapModel = require('../model/swap.server.model');
var OfferModel = require('../model/offer.model');

/**
 * Sign in
 * @param req
 * @param res
 * @param next
 */
exports.loging = function (req, res, next) {
    // get the values from req.body
    let email = req.body.email.trim();
    let password = req.body.password.trim();
    // let email = 'ron.king@gmail.com';
    // let password = 'test123';
    let data = {};
    let message = '';
    // get the user data
    var query = SwapModel.UserModel.findOne({email: email, password: password});
    query.exec(function (err, docs) {
        
        console.log("From server controller--login--" + docs);
        console.log("Password" + docs._id);
        console.log(password);
        if (docs.password === password) {
            console.log('Login Success!');
            req.session.theUser = docs;
            req.session.loginFlag = true;
            data.docs = req.session.theUser;
            data.title = 'Home';
            data.loginFlag = req.session.loginFlag;
            data.theUser = req.session.theUser;
            
            res.render('index', {data: data});
        } else {
            console.log('Login failed!');
            // data.message = 'Invalid Password';
            data.title = 'Home';
            data.loginFlag = false;
            res.render('index', {data: data});
        }
    })
    
};

/**
 * Get all users items for my items page
 * @param req
 * @param res
 * @param next
 */
exports.getMyItems = function (req, res, next) {
    var self = this;
    console.log('getMyItems received');
    let data = {
        items: {},
    };
    data.title = 'My Items';
    // check if the user is logged in or not?
    let loginFlag = req.session.loginFlag;
    if (undefined === loginFlag || null === loginFlag || false === loginFlag) {
        // user is not logged in
        console.log('User is not logged in');
        data.loginFlag = false;
        res.render('myItems', {data: data});
    } else {
        console.log('User is logged in');
        data.loginFlag = req.session.loginFlag;
        data.theUser = req.session.theUser;
        data.docs = req.session.theUser;
        let items = [];
        let userId = data.theUser._id;
        // get user items
        var query = SwapModel.ItemModel.find({userId: userId});
        query.exec(function (err, docs) {
            console.log("Get Items - " + docs.length);
            data.items = docs;
            res.render('myItems', {data: data});
        });
        
    }
};

/**
 * Add new item to system
 * @param req
 * @param res
 * @param next
 */
exports.addNewBook = function (req, res, next) {
    
    let data = {
        items: {},
    };
    console.log("Book name-" + req.body.bookName);
    let bookName = req.body.bookName;
    let rating = req.body.rating;
    let catalogCategory = req.body.catalogCategory.toLocaleLowerCase();
    let description = req.body.description;
    let author = req.body.author;
    let imageUrl = req.body.imageUrl;
    let userId = req.session.theUser._id;
    var newBook = new SwapModel.ItemModel({
        bookName: bookName,
        author: author,
        catalogCategory: catalogCategory,
        description: description,
        rating: rating,
        imageUrl: imageUrl,
        userId: userId
    });
    var promise = newBook.save();
    // assert.ok(promise instanceof Promise);
    promise.then(function (docs) {
        data.message = {
            flag: true,
            text: 'Success!New book added!'
        }
        data.loginFlag = req.session.loginFlag;
        data.theUser = req.session.theUser;
        data.docs = req.session.theUser;
        let items = [];
        let userId = data.theUser._id;
        // get user items
        SwapModel.ItemModel.find({userId: userId}).then(function (docs) {
            data.items = docs;
            res.render('myItems', {data: data});
        });
    }).catch(function (err) {
        if (err) {
            data.message = {
                flag: true,
                text: 'Falied!Try after some time!!'
            }
        }
        data.title = 'My Items';
        data.loginFlag = req.session.loginFlag;
        data.theUser = req.session.theUser;
        data.docs = req.session.theUser;
        res.render('myItems', {data: data});
    });
};

/**
 * Delete an item
 * @param req
 * @param res
 * @param next
 */
exports.deleteBook = function (req, res, next) {
    console.info('Profile controller - deleteBook');
    let bookId = req.body.bookId;
    let data = {};
    
    data.loginFlag = req.session.loginFlag;
    data.theUser = req.session.theUser;
    data.docs = req.session.theUser;
    
    SwapModel.ItemModel.deleteBook(bookId).then(function (docs) {
        SwapModel.ItemModel.find({userId: data.theUser._id}).then(docs => {
            data.items = docs;
            data.message = {
                flag: true,
                text: 'Success! deleted the book!'
            }
            res.render('myItems', {data: data});
        })
    }).catch(function (err) {
        
        data.message = {
            flag: false,
            text: 'Failed! Soemthing went wrong please try after some time   !'
        }
        console.error(err);
    })
}

/**
 * Sign up
 * @param req
 * @param res
 * @param next
 */
exports.signUp = function (req, res, next) {
    let data = {};
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.passwrd;
    let address1 = req.body.address1;
    let address2 = req.body.address2;
    let city = req.body.city;
    let state = req.body.state;
    let postCode = req.body.postCode;
    let country = req.body.country;
    
    var newUser = new SwapModel.UserModel({
        firstName: firstName,
        lastName: lastName,
        email: email,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        postCode: postCode,
        country: country,
        password: password
    });
    
    newUser.save().then((docs) => {
        console.log(docs);
        req.session.theUser = docs;
        req.session.loginFlag = true;
        data.docs = req.session.theUser;
        data.title = 'Home';
        data.loginFlag = req.session.loginFlag;
        data.theUser = req.session.theUser;
        res.render('index', {data: data});
    }).catch((err) => {
        console.log(err);
        console.log('Login failed!');
        // data.message = 'Invalid Password';
        data.title = 'Home';
        data.loginFlag = false;
        res.render('index', {data: data});
    });
};

/**
 * Logout Function
 * @param req
 * @param res
 * @param next
 */
exports.logout = function (req, res, next) {
    console.log('From server logout received');
    req.session.loginFlag = false;
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log("Logged Out!" + JSON.stringify(req.session));
                return res.redirect(301, '/');
            }
        });
    }
};

/**
 * My Swaps page main function
 * @param req
 * @param res
 * @param next
 */
exports.mySwaps = function (req, res, next) {
    
    console.log('Profile controller - mySwaps');
    
    let data = {
        items: {},
    };
    data.title = 'My Swaps';
    // check if the user is logged in or not?
    let loginFlag = req.session.loginFlag;
    if (undefined === loginFlag || null === loginFlag || false === loginFlag) {
        // user is not logged in
        console.log('User is not logged in');
        data.loginFlag = false;
        res.render('mySwaps', {data: data});
    } else {
        console.log('User is logged in');
        data.loginFlag = req.session.loginFlag;
        data.theUser = req.session.theUser;
        data.docs = req.session.theUser;
        let items = [];
        let userId = data.theUser._id;
        // get the user requests
        OfferModel.Offers.find({"userId": userId, "itemStatus": {$eq: 'pending'}}).then(docs => {
            data.userRequestedSwaps = docs;
            OfferModel.Offers.find({"itemUserId": userId, "itemStatus": {$eq: 'pending'}}).then(docs => {
                data.othersRequestedSwaps = docs;
                return mySwapsRender(req, res, next, data);
            }).catch(err => {
                console.error(err);
            })
        }).catch(err => {
            console.error(err);
        })
    }
    
}

/**
 * Rendering mySwaps page
 * @param req
 * @param res
 * @param next
 * @param data
 */
function mySwapsRender(req, res, next, data) {
    // console.log(data);
    let userRequestedSwaps = data.userRequestedSwaps;
    let othersRequestedSwaps = data.othersRequestedSwaps;
    let userRqSwapsTemp = new Array();
    let otherRqSwapsTemp = new Array();
    
    
// for every user requested swaps, get both the item details
    if(userRequestedSwaps.length > 0){
    
        for (let i = 0; i < userRequestedSwaps.length; i++) {
            let tempObject = new Object();
            tempObject.offerId = userRequestedSwaps[i]._id;
            tempObject.offerStatus = userRequestedSwaps[i].itemStatus;
            SwapModel.ItemModel.getBook(userRequestedSwaps[i].itemCodeOwn).then(docs => {
                tempObject.userItem = docs;
                SwapModel.ItemModel.getBook(userRequestedSwaps[i].itemCodeWant).then(docs => {
                    tempObject.otherItem = docs;
                    console.log(tempObject);
                    if(Array.isArray(userRqSwapsTemp)){
                        userRqSwapsTemp.push(tempObject)
                    } else{
                        userRqSwapsTemp = [tempObject];
                    }
                })
            })
        }
    }
    data.userRequestedSwaps = userRqSwapsTemp;
    console.log(data.userRequestedSwaps);
    
    // for every other user requested swaps, get both the item details
    if(othersRequestedSwaps.length > 0){
        for(let i=0; i< othersRequestedSwaps.length;i++){
            let tempObject = new Object();
            tempObject.offerId = othersRequestedSwaps[i]._id;
            tempObject.offerStatus = othersRequestedSwaps[i].itemStatus;
            // find the user items
            SwapModel.ItemModel.getBook(othersRequestedSwaps[i].itemCodeWant).then(docs => {
                tempObject.userItem = docs;
                SwapModel.ItemModel.getBook(othersRequestedSwaps[i].itemCodeOwn).then(docs => {
                    tempObject.otherItem = docs;
                    if(Array.isArray(otherRqSwapsTemp)){
                        otherRqSwapsTemp.push(tempObject);
                    } else{
                        otherRqSwapsTemp = [tempObject];
                    }
                    
                    
                }).catch(err => {
                    console.error(err);
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }
    data.othersRequestedSwaps = otherRqSwapsTemp
    
    setTimeout(() =>{
        console.log("data-"+JSON.stringify(data));
        res.render('mySwaps',{data:data});
    },3000);
    
}

/**
 * withdraw an offer
 * @param req
 * @param res
 * @param next
 */
exports.withdrawOffer = function (req, res, next) {
    console.info("Profile controller - withdrawOffer");
    let data = {};
    let offerId = req.body.offerId.trim();
    let userBookId = req.body.userBookId;
    let otherBookId = req.body.otherBookId;
    console.log("OfferId - "+offerId);
    // update the offer status
    OfferModel.updateOffer(offerId,'withdrawn').then(docs => {
        console.log("Updated Offer - "+docs);
        // update the use book status to available
        SwapModel.ItemModel.updateStatus(userBookId,'available').then(docs =>{
            // update the status of other book
            SwapModel.ItemModel.updateStatus(otherBookId,'available').then(docs => {
                res.redirect(301,'/mySwaps');
            }).catch(err => {
                console.error(err);
            })
        }).catch(err =>{
            console.error(err);
        })
    }).catch(err =>{
        console.error(err);
    })
    
    
}


/**
 * Accept offer
 * @param req
 * @param res
 * @param next
 */
exports.acceptOffer = function (req, res, next) {
    console.info("Profile controller - withdrawOffer");
    let data = {};
    let offerId = req.body.offerId.trim();
    let userBookId = req.body.userBookId;
    let otherBookId = req.body.otherBookId;
    console.log("OfferId - "+offerId);
    // update the offer status
    OfferModel.updateOffer(offerId,'swapped').then(docs => {
        console.log("Updated Offer - "+docs);
        // update the use book status to available
        SwapModel.ItemModel.updateStatus(userBookId,'swapped').then(docs =>{
            // update the status of other book
            SwapModel.ItemModel.updateStatus(otherBookId,'swapped').then(docs => {
                res.redirect(301,'/mySwaps');
            }).catch(err => {
                console.error(err);
            })
        }).catch(err =>{
            console.error(err);
        })
    }).catch(err =>{
        console.error(err);
    })
    
    
}

/**
 * Reject offer
 * @param req
 * @param res
 * @param next
 */
exports.rejectOffer = function (req, res, next) {
    console.info("Profile controller - withdrawOffer");
    let data = {};
    let offerId = req.body.offerId.trim();
    let userBookId = req.body.userBookId;
    let otherBookId = req.body.otherBookId;
    console.log("OfferId - "+offerId);
    // update the offer status
    OfferModel.updateOffer(offerId,'rejected').then(docs => {
        console.log("Updated Offer - "+docs);
        // update the use book status to available
        SwapModel.ItemModel.updateStatus(userBookId,'available').then(docs =>{
            // update the status of other book
            SwapModel.ItemModel.updateStatus(otherBookId,'available').then(docs => {
                res.redirect(301,'/mySwaps');
            }).catch(err => {
                console.error(err);
            })
        }).catch(err =>{
            console.error(err);
        })
    }).catch(err =>{
        console.error(err);
    })
    
    
}

