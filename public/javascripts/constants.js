angular.module('rentomojoConsants', [])

.constant('CONSTANTS', {
	"API"		: "http://35.234.216.28/api/v1",
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