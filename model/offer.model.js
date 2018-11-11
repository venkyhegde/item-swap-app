/**
 *OfferDB – create the function “OfferDB” to store and get offer details into and from the database:
 * addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus) – this method adds an offer to the database. The userID here refers to the user that is making the offer and itemCodeOwn is the itemCode that this user owns and itemCodeWant is the item code they would like to get.
 * updateOffer(offerID, itemStatus) – this method updates the status of the offer in the database.
 * @type {*|Mongoose}
 */
// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Offers = new Schema({
    userId:{
    type:String,
    required: true,
    },
    itemCodeOwn:{
        type: String,
        required: true,
    },
    itemCodeWant:{
        type: String,
        required: true
    },
    itemUserId:{
        type:String,
        required: true
    },
    itemStatus:{
        type: String,
        required: true,
    }
});

const Offer = mongoose.model('Offers', Offers);

module.exports.Offers = Offer;

/**
 *  addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus) – this method adds an offer to the database. The userID
 *  here refers to the user that is making the offer and itemCodeOwn is the itemCode that this user owns and
 *  itemCodeWant is the item code they would like to get.
 * @param userId
 * @param itemCodeOwn
 * @param itemCodeWant
 * @param itemUserId
 * @param itemStatus
 * @returns {Promise<any>}
 */
module.exports.addOffer = function (userId, itemCodeOwn, itemCodeWant, itemUserId, itemStatus) {
    console.log("From Offer - "+userId+" "+itemCodeOwn+" "+itemCodeWant+" "+itemUserId+" "+itemStatus);
    return new Promise((resolve, reject) => {
        var newOffer = new Offer({
            userId: userId,
            itemCodeOwn: itemCodeOwn,
            itemCodeWant: itemCodeWant,
            itemUserId: itemUserId,
            itemStatus: itemStatus
        });
        newOffer.save().then(docs =>{
            resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    });
}

/**
 * updateOffer(offerID, itemStatus) – this method updates the status of the offer in the database.
 * @param offerId
 * @param itemStatus
 * @returns {Promise<any>}
 */
module.exports.updateOffer = function (offerId, itemStatus) {
    return new Promise((resolve, reject) => {
        Offer.findOneAndUpdate({"_id":offerId},{"itemStatus":itemStatus},{new: true}).then(docs =>{
            console.log("From Offer - "+docs);
            resolve(docs);
        }).catch(err => {
            return reject(err);
        })
    })
}

