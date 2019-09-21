const { User }      = require('../models');
const { to, sendError , sendSuccess }  = require('../services/util.service');
const {AppError} = require('../services/errorHandler.service')
const { check, validationResult } = require('express-validator/check');
const { OK ,ACCEPTED ,BAD_GATEWAY ,BAD_REQUEST ,UNAUTHORIZED ,UNPROCESSABLE_ENTITY , NOT_FOUND} = require('../utility/statuscodes');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;

    // req.checkBody('email', BAD_REQUEST).notEmpty() ;
    req.checkBody('name',BAD_REQUEST).notEmpty();
    req.checkBody('password',BAD_REQUEST).notEmpty();
    req.checkBody('phone',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }    

    let err, user;

    [err, user] = await to(User.create(body));
    if(err) return sendError(res, err, UNPROCESSABLE_ENTITY);
    
    return sendSuccess(res, {message:'Successfully created new user.', token:user.getJWT()});

}
module.exports.create = create;

const userInfo = async function(req,res){
    res.setHeader('Content-Type', 'application/json');

    const id = req.decoded.user_id ; 
    let err,user ;
    [err,user] = await to(User.findOne({_id : id , act :true},{name : 1 , phone:  1}));

    if(err) return sendError(res,err,UNPROCESSABLE_ENTITY);
    if(user == null) return sendError(res,{message : "User Not Found"},NOT_FOUND);

    return sendSuccess(res,user);
}
module.exports.userInfo = userInfo ;

const login = async function(req, res){
    const body = req.body;
    
    req.checkBody('password',BAD_REQUEST).notEmpty();
    req.checkBody('phone',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }    
        
    let err, user, pass;

    [err, user] = await to(User.findOne({phone : body.phone , act :true})) ;
    if(err) return sendError(res, err, UNPROCESSABLE_ENTITY);
    if(!user) return sendError(res , {message : "User not found"}  , NOT_FOUND) ;

    [err, pass] = await to(user.comparePassword(body.password));
    if(err) return sendError(res, err, UNPROCESSABLE_ENTITY);

    if(!pass) return sendError(res , {message : "Invalid password"} , NOT_FOUND)
    return sendSuccess(res, {token:user.getJWT()});
} 
module.exports.login = login;