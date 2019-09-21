const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const validate          = require('mongoose-validator');
const {TE , to}          = require('../services/util.service');
const CONFIG            = require('../config/config');
const ObjectId 			= mongoose.Types.ObjectId;

let postCommentsSchema = mongoose.Schema({
	postId 			: { type : ObjectId , required : true } ,
	tim 			: { type : Date , required : true } ,
	text 			: { type : String , required : true } ,
	createdBy 	    : { type : ObjectId , require : true } ,
	parentComment 	: { type : ObjectId , required : false },
	act             : { type : Boolean , required : true , default : true}
}, {timestamps: true});

postCommentsSchema.index({parentComment : 1 , act : 1}) ;
postCommentsSchema.index({createdBy : 1 , act : 1}) ;
postCommentsSchema.index({postId : 1 , act : 1}) ;

postCommentsSchema.statics = {
	parentCommentsOfPost : async(postId) => {
		return PostComment.aggregate([
		{
			'$match': {
				'postId': ObjectId(postId), 
				'parentComment': {
					'$exists': false
				} ,
				'act' : true
			}
		}, {
			'$lookup': {
				'from': 'users', 
				'localField': 'createdBy', 
				'foreignField': '_id', 
				'as': 'user'
			}
		}, {
			'$unwind': {
				'path': '$user'
			}
		}, {
			'$project': {
				'userName': '$user.name', 
				'tim': 1, 
				'text': 1, 
				'postId': 1 ,
				'createdBy' : 1
			}
		} ,{
			'$sort' : {
				'tim' : -1
			}
		}
		])
	} ,

	childComments : async(parentCommentId) =>{
		return PostComment.aggregate([
		{
			'$match': {
				'parentComment': ObjectId(parentCommentId), 
				'act' : true
			}
		}, {
			'$lookup': {
				'from': 'users', 
				'localField': 'createdBy', 
				'foreignField': '_id', 
				'as': 'user'
			}
		}, {
			'$unwind': {
				'path': '$user'
			}
		}, {
			'$project': {
				'userName': '$user.name', 
				'tim': 1, 
				'text': 1, 
				'postId': 1 ,
				'createdBy' : 1
			}
		}, {
			'$sort' : {
				'tim' : -1
			}
		}
		])
	}
}


let PostComment = module.exports = mongoose.model('PostComment', postCommentsSchema);