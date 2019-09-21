const {  Posts}      = require('../models');
const { to, sendError , sendSuccess }  = require('../services/util.service');
const { check, validationResult } = require('express-validator/check');
const { OK ,ACCEPTED ,UNPROCESSABLE_ENTITY , NOT_FOUND,BAD_REQUEST} = require('../utility/statuscodes');


const getPosts = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');
	// let page , limit ;
	
	// page = req.query.page ? req.query.page : 1 ;
	// limit = req.query.limit ? req.query.limit : 10 ; 

	let err , posts ;
	[err , posts] = await to(Posts.find({act : true}))

	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	return sendSuccess(res,posts)
}

module.exports.getPosts = getPosts ;


const getPost = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');

    req.checkQuery('postId',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }  

	const postId = req.query.postId ;

	let err , post ;

	[err , post] = await to(Posts.findOne({_id : postId , act : true})) ;
	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	if(post == null) return sendError(res, err , NOT_FOUND)

	return sendSuccess(res,post)
}

module.exports.getPost = getPost ;

const createPost = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');
	
	req.checkBody('text',BAD_REQUEST).notEmpty();
    req.checkBody('topic',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }    

    let err , post ;
    [err , post] = await to(Posts.create({
    	text : req.body.text ,
    	topic : req.body.topic ,
    	tim : new Date() ,
    	author : req.decoded.user_id
    })) ;

	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	return sendSuccess(res,post)
}

module.exports.createPost = createPost ;

// const createPost = async(req,res) => {
// 	res.setHeader('Content-Type', 'application/json');

// 	const postId = req.params.id ;
// 	let err , post ;

// 	[err , post] = await to(Posts.findOne({_id : postId , act : true})) ;
// 	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

// 	if(post == null) return sendError(res, err , NOT_FOUND)

// 	return sendSuccess(res,post)
// }

// module.exports.createPost = createPost ;


// const createPost = async(req,res) => {
// 	res.setHeader('Content-Type', 'application/json');

// 	const postId = req.params.id ;
// 	let err , post ;

// 	[err , post] = await to(Posts.findOne({_id : postId , act : true})) ;
// 	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

// 	if(post == null) return sendError(res, err , NOT_FOUND)

// 	return sendSuccess(res,post)
// }

// module.exports.createPost = createPost ;



