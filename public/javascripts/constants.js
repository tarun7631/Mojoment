angular.module('rentomojoConsants', [])

.constant('CONSTANTS', {
	"API"		: "http://localhost:3000/api/v1",
	"login"		: "/user/login" ,
	"signup"	: "/user" ,
	"userInfo"	: "/user" ,
	"post"  : "/post" ,
	"getAllPosts" : "/posts" ,
	"comment" : "/comment" ,
	"parrentComments" : "/comments/post" ,
	"childComments" : "/comments/child_comments" ,
	"comment" 		: "/comment"
});