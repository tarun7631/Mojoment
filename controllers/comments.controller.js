const { PostComments }      = require('../models');
const { to, sendError , sendSuccess }  = require('../services/util.service');
const { check, validationResult } = require('express-validator/check');
const { OK ,ACCEPTED ,UNPROCESSABLE_ENTITY , NOT_FOUND,BAD_REQUEST , FORBIDDEN} = require('../utility/statuscodes');


// const getPost = async(req,res) => {
// 	res.setHeader('Content-Type', 'application/json');

// 	console.log('here1');
//     req.checkQuery('postId',BAD_REQUEST).notEmpty();

//     if(req.validationErrors()){
//         return sendError(res, req.validationErrors() , BAD_REQUEST)
//     }  

// 	const postId = req.query.postId ;

// 	console.log(postId)
// 	let err , post ;

// 	[err , post] = await to(Posts.findOne({_id : postId , act : true})) ;
// 	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

// 	if(post == null) return sendError(res, err , NOT_FOUND)

// 	return sendSuccess(res,post)
// }

// module.exports.getPost = getPost ;

const createComment = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');
	
	req.checkBody('text',BAD_REQUEST).notEmpty();
    req.checkBody('postId',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }    

    let err , comment ;
    [err , comment] = await to(PostComments.create({
    	postId : req.body.postId ,
    	text : req.body.text ,
    	tim : new Date() ,
    	createdBy : req.decoded.user_id ,
    	parentComment : req.body.parentComment 
    })) ;

	if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	return sendSuccess(res,comment)
}

module.exports.createComment = createComment ;

const getParentCommentOfPost = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');
	
    req.checkParams('id',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    }    

    const postId = req.params.id ;

    let err , comments ;


    [err , comments] = await to(PostComments.parentCommentsOfPost(postId))

    if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	return sendSuccess(res,comments)
}

module.exports.getParentCommentOfPost = getParentCommentOfPost ;

const getChildComments = async(req,res) => {
	res.setHeader('Content-Type', 'application/json');
	
    req.checkQuery('parentCommentId',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    } 
    const parentCommentId = req.query.parentCommentId ;

    let err , comments ;
    [err,comments] = await to(PostComments.childComments(parentCommentId)) ;

    if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

	return sendSuccess(res,comments)
}

module.exports.getChildComments = getChildComments ;

const deleteComment = async(req,res) => {
    res.setHeader('Content-Type', 'application/json');

    req.checkParams('id',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    } 

    const id = req.params.id ;
    // if(id != req.decoded.user_id){
    //     return sendError(res,{message: "Not a Valid user"},FORBIDDEN)
    // }

    let err , comment ;

    [err,comment] = await to(PostComments.updateOne({_id : id} , {$set : {act : false}})) ;

    if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

    return sendSuccess(res,comment)   
}

module.exports.deleteComment = deleteComment ;

const updateComment = async(req,res) => {
    res.setHeader('Content-Type', 'application/json') ;

    req.checkParams('id',BAD_REQUEST).notEmpty();
    req.checkBody('text',BAD_REQUEST).notEmpty();

    if(req.validationErrors()){
        return sendError(res, req.validationErrors() , BAD_REQUEST)
    } 

    const id = req.params.id ;
    const text = req.body.text ;

    let err , comment ;
   
    [err , comment] = await to(PostComments.updateOne({_id : id},{$set : {text : text}})) ;

    if(err) return sendError(res, err , UNPROCESSABLE_ENTITY)

    return sendSuccess(res,comment)     
}

module.exports.updateComment = updateComment ;

