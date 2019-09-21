const mongoose 			= require('mongoose');
const bcrypt 			= require('bcrypt');
const bcrypt_p 			= require('bcrypt-promise');
const jwt           	= require('jsonwebtoken');
const validate          = require('mongoose-validator');
const {TE , to}          = require('../services/util.service');
const CONFIG            = require('../config/config');
const ObjectId 			= mongoose.Schema.ObjectId;

let postSchema = mongoose.Schema({
	topic 			: { type : String , required : true },
	tim 			: { type : Date , required : true },
	text 			: { type : String , required : true },
	author 			: { type : ObjectId , require : true }, // author
    act             : { type : Boolean , required : true , default : true}
}, {timestamps: true});

postSchema.index({topic : 1 , act : 1}) ;
postSchema.index({auther : 1 , act : 1}) ;

let Posts = module.exports = mongoose.model('Posts', postSchema);