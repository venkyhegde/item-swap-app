var express = require('express');

var profilerController = require('../controller/profile.server.controller');
var catalogController = require('../controller/catalog.server.controller');
/* GET home page. */
module.exports.controller =function(app){
    console.log("Inside controller");
    app.get('/catalogCategory', function (req, res, next) {
        console.log('From client controler-categories');
        return catalogController.categories(req, res, next);
    });
    
    
    app.get('/', function(req, res, next) {
        console.log("Inside app.get('/')");
        let data = {
            title: 'Home',
        }
        
        if (req.session.loginFlag){
            data.docs = req.session.theUser;
            data.loginFlag = req.session.loginFlag;
            data.theUser = req.session.theUser;
            res.render('index', { data: data, });
        } else{
            data.loginFlag = false;
            res.render('index', {data: data});
        }
        
    });
    app.post('/', function (req, res, next) {
        console.log("Inside app.post('/')");
        // redirect to server controller
        var action = req.body.action;
        if(action === 'login'){
            console.log('Sending to server login finction');
            return profilerController.loging(req, res, next);
        }
        if(action === 'signup'){
            return profilerController.signUp(req, res, next);
        }
        if(action === 'logout'){
            console.log('Logout called');
            return profilerController.logout(req, res, next);
        }

        
    });
    
    app.get('/myItems', function (req, res, next) {
        // redirect to server controller
        return profilerController.getMyItems(req, res, next);
    });
    
    
    app.post('/myItems', function (req, res, next) {
        // check the action
        let action = req.body.action;
        if('addnewbook' === action){
            return profilerController.addNewBook(req, res, next);
        }
        if('deleteBook' === action){
            return profilerController.deleteBook(req, res, next);
        }
    });
    
    app.get('/catalogCategory/:categoryName', function (req, res, next) {
        let categoryName = req.params.categoryName.trim();
        console.log("Category Name - "+categoryName);
        // redirect to server controller
        return catalogController.getCatalogItems(req, res, next);
        
    });
    
    app.get('/catalogCategory/:categoryName/:_id', function (req, res, next) {
        let categoryName = req.params.categoryName.trim();
        let _id = req.params._id.trim();
        console.log("controller - /catalogCategory/:categoryName/:_id"+categoryName+" "+_id);
        return catalogController.getItem(req, res, next);
    });
    
    app.post('/catalogCategory/:categoryName/:_id', function (req, res, next) {
        let categoryName = req.params.categoryName.trim();
        let _id = req.params._id.trim();
        let action = req.body.action;
        console.log("controller - /catalogCategory/:categoryName/:_id"+categoryName+" "+_id);
       if('ratefromitem' === action){
            return catalogController.updateGeneralRating(req, res, next, _id);
       }
    });
    
    app.get('/mySwaps', function (req, res, next) {
        console.log('Controller - /mySwaps.get');
        return profilerController.mySwaps(req, res, next);
    });
    
    
    app.post('/mySwaps', function (req, res, next) {
        console.log('Controller - /mySwaps.post');
        let action = req.body.action;
        if('withdrawform' === action){
            return profilerController.withdrawOffer(req, res, next);
        }
        if('acceptform' === action){
            return profilerController.acceptOffer(req, res, next);
        }
        if('rejectform' === action){
            return profilerController.rejectOffer(req, res, next);
        }
    });
    
    app.post('/swapIt', function (req, res, next) {
        console.log('Controller - /swapIt.post'+req.body.action);
         if('swapit' === req.body.action){
             console.log('Controller - /swapIt.post');
         return catalogController.swapIt(req, res, next);
         }
         if('swapItConfirm' === req.body.action){
             console.info('Controller -/swapIt.post - action:'+req.body.action);
             return catalogController.confirmSwap(req, res, next);
         }
    })
    
};

