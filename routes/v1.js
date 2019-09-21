const express 			= require('express');
const router 			= express.Router();

const userController 	= require('../controllers/user.controller');
// const formController 	= require('../controllers/forms.controller');
const postController    = require('../controllers/posts.controller');
const commentController    = require('../controllers/comments.controller');
const path              = require('path');
const {checkToken,checkValidUserForCommentAction}	    = require('../middlewares/auth.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});



/**
 * @api {post} /v1/user/ Create User
 * @apiName UserRegister
 * @apiGroup User
 * @apiParam {String} phone phone/userid
 * @apiParam {String} email email
 * @apiParam {name} name name
 * @apiParam {String} password password
 * @apiParamExample {json} Input
 *    {
	 "phone": "8569947061" ,
	 "password" : "tarun" ,
	 "name" : "tarun" ,
	 "email" : "tarun@eckovation.com" ,
 *    }
 * @apiSuccess {String} success 
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 	"success": "true",
 	"token" : "HNxp70NdZwJ8EDqUcG7P5rtfuv4ANCfSgo9GsVmjVuM"
 	"message": "Successfully created new user."
 *    }
 *
 */
router.post('/user', userController.create);


/**
 * @api {post} /v1/user/login User Login
 * @apiName UserLogin
 * @apiGroup User
 * @apiParam {String} phone phone/userid
 * @apiParam {String} password password
 * @apiParamExample {json} Input
 *    {
 *      "phone": "8569947061" ,
 *		"password" : "tarun"
 *    }
 * @apiSuccess {String} success 
 * @apiSuccess {String} token
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 	"success": "true",
 	"token" : "HNxp70NdZwJ8EDqUcG7P5rtfuv4ANCfSgo9GsVmjVuM"
 *    }
 *
 */


router.get('/user', checkToken ,userController.userInfo);
router.post('/user/login', userController.login);


router.post('/comment',checkToken , commentController.createComment);
router.get('/comments/post/:id',commentController.getParentCommentOfPost);
router.get('/comments/child_comments',commentController.getChildComments)
router.delete('/comment/:id',checkToken,checkValidUserForCommentAction ,commentController.deleteComment);
router.put('/comment/:id',checkToken,checkValidUserForCommentAction ,commentController.updateComment);

router.post('/post',checkToken,postController.createPost);
router.get('/post',postController.getPost);
router.get('/posts',postController.getPosts);

// router.get('/forms',formController.getForms);
// router.get('/forms/:id',formController.getForm);
// router.post('/forms/:id/submission',formController.saveFormSubmission);
// router.get('/forms/:id/submission',formController.getFormSubmissions);
// router.get('/forms/:id/submission/:submissionId',formController.getFormSubmission);
// router.put('/forms/:id/submission/:submissionId',formController.editFormSubmission);
// router.get()

module.exports = router;
