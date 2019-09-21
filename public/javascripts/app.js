angular.module('rentomojo', [
	'ngCookies',
	'ngMaterial',
	"ui.router",
	"angular-loading-bar",
	"rentomojoServices",
	"rentomojoConsants",
	"rentomojoControllers",
	"rentomojoDirectives"])
.config(config);


config.$inject = ['$httpProvider', '$compileProvider' , '$stateProvider', '$urlRouterProvider'];


function config($httpProvider, $compileProvider ,$stateProvider, $urlRouterProvider) {


$stateProvider
.state('home', {
	templateUrl: 'views/home.html',
	abstract: true,
	controller: 'mainController',
})
.state('home.posts',{
	url : '/posts',
	templateUrl: 'views/posts.html',
	controller: 'postController',
})
.state('home.post', {
	url : '/post/:id',
	templateUrl: 'views/comments.html',
	controller: 'postCommentsController',
});


$urlRouterProvider.otherwise('/posts');


}
