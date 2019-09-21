angular.module('rentomojoControllers', ["ngCookies" ,"ngMaterial"])
		
.controller('mainController', function($scope,$sce,CONSTANTS,$cookies,$window,$timeout,$mdToast,QueryService,$mdDialog) {

	var init = function(){
		var token = $cookies.get('x-access-token') ;
		if(!token) return ;
		QueryService.query('GET',{'x-access-token' : token},CONSTANTS.userInfo,{},{})
		.then(function(res){
			$scope.userName = res.data.name ;
			$scope.userId = res.data._id ;
			console.log(res)
		})
		.catch(function(err){
			showErr(err.data.error)
		})
	}
	
	$scope.removeCookies = function(){
		$cookies.remove('x-access-token');
		$scope.userName = null ;
	}

	$scope.openLoginDialog = function(ev){
		$mdDialog.show({
	        controller: DialogController,
	        templateUrl: 'Add.Dialog.html',
	        targetEvent: ev,
	        clickOutsideToClose:true
	    })
	}
	var showErr = function(msg){
		$mdToast.show(
	        $mdToast.simple()
	        .textContent(msg)
	        .position('top right')
	        .hideDelay(3000)
	    )
	} 

	function DialogController($cookies , $scope, $mdDialog) {

		$scope.selectLoginForm = true ;
		$scope.selectSignupForm = false ;

		$scope.loginForm = function(){
			$scope.selectLoginForm = true ;
			$scope.selectSignupForm = false ;
		}

		$scope.signupForm = function(){
			$scope.selectLoginForm = false ;
			$scope.selectSignupForm = true ;
		}
		// $scope.hide = function() {
		//     $mdDialog.hide();
		// };
		// $scope.cancel = function() {
		//     $mdDialog.cancel();
		// };
		$scope.login = function() {
			QueryService.query('POST',{},CONSTANTS.login,{},{phone : $scope.pNo , password : $scope.pwd})
			.then(function(res){
				$cookies.put('x-access-token',res.data.token)
				init()
				$mdDialog.cancel();
			})
			.catch(function(err){
				showErr(err.data.error)
			})
		};
		$scope.signup = function() {
			QueryService.query('POST',{},CONSTANTS.signup,{},{phone : $scope.pNo , password : $scope.pwd , name : $scope.name})
			.then(function(res){
				$cookies.put('x-access-token',res.data.token)
				init()
				$mdDialog.cancel();
			})
			.catch(function(err){
				showErr(err.data.error)
			})
		}
	};

	init()

})

.controller('postCommentsController', function($compile ,$scope,$sce,CONSTANTS,$cookies,$window,$timeout,$mdToast,QueryService,$mdDialog,$state,$stateParams) {
	
	var init = function(){
		$scope.text = null ;
		$scope.commentsByParentId = {} ;
		QueryService.query('GET',{},CONSTANTS.post,{postId : $stateParams.id},{})
		.then(function(res){
			$scope.post = res.data ;
		})
		.catch(function(err){
			showPopup(err.data.error)
		})

		QueryService.query('GET',{},CONSTANTS.parrentComments + '/' + $stateParams.id ,{},{})
		.then(function(res){
			$scope.comments = res.data ;
		})
		.catch(function(err){
			showPopup(err.data.error)
		})

	}

	$scope.deleteComment = function(id ,parentCommentID){
		QueryService.query('DELETE',{'x-access-token' : $cookies.get('x-access-token')},CONSTANTS.comment + '/' + id,{},{})
		.then(function(res){
			showPopup('Comment Deleted')

			if(parentCommentID) $scope.loadReply(parentCommentID)
			else init()
			// $scope.post = res.data ;
		})
		.catch(function(err){
			showPopup(err.data.error)
		})
	}

	$scope.editComment = function(id , text, parentCommentID){
		QueryService.query('PUT',{'x-access-token' : $cookies.get('x-access-token')},CONSTANTS.comment + '/' + id,{},{
			text : text 
		})
		.then(function(res){
			showPopup('Comment Updated')

			if(parentCommentID) $scope.loadReply(parentCommentID)
			else init()
			// $scope.post = res.data ;
		})
		.catch(function(err){
			showPopup(err.data.error)
		})	
	}

	$scope.saveReply = function(reply , id){

		if(!reply){
			return
		}

		if(!$cookies.get('x-access-token')){
			$scope.openLoginDialog()
			return
		} 

		QueryService.query('POST',{'x-access-token' : $cookies.get('x-access-token')},CONSTANTS.comment,{},{
			text : reply ,
			parentComment : id ,
			postId : $scope.post._id 
		})
		.then(function(res){
			showPopup('Comment Posted')
			$scope.loadReply(id)
		})
		.catch(function(err){
			showPopup(err.data.error)
		})
	}

	$scope.loadReply = function(id ){
		var elemId = id + '' ;
		QueryService.query('GET',{},CONSTANTS.childComments,{parentCommentId : elemId},{})
		.then(function(res){
			console.log(res);
			$scope.commentsByParentId[id] = res.data ; 
			// $scope.comments
			var elem = angular.element(document.getElementById(elemId));


			if(elem[0].children.length == 1)
				elem.append($compile(angular.element(elemStr(id)))($scope));
			else
				elem[0].children[1] = $compile(angular.element(elemStr(id)))($scope);

			console.log(elem)

		})
		.catch(function(err){
			console.log(err)
			showPopup(err.data.error)
		})
	}


	var elemStr = function(parentId){

		// if($scope.commentsByParentId[parentId].length == 0){
		// 	return `<div class="comments-list reply-list no-reply"> No Reply</div>`
		// }

		return `
			<div class="comments-list reply-list no-reply" ng-if="commentsByParentId['${parentId}'].length == 0"> No Reply</div>

			<ul class="comments-list reply-list" ng-if="commentsByParentId['${parentId}'].length != 0">
				<li ng-repeat="d in commentsByParentId['${parentId}']" id={{d._id}} style="padding-top:15px">
					<div>
					<div class="comment-avatar"><img src="https://i.stack.imgur.com/frlIf.png" alt=""></div>
					
					<div class="comment-box">
						<div class="comment-head">
							<h6 class="comment-name">{{d.userName}}</h6>
							<span>{{d.tim | date}}</span>
							<i class="fa fa-trash-o" ng-if="userId == d.createdBy" ng-click="deleteComment(d._id , '${parentId}')"></i>
							<i class="fa fa-pencil-square-o" ng-if="userId == d.createdBy" ng-click="d.isEdit = true"></i>
						</div>
						<div class="comment-content" ng-if="!d.isEdit"> 
							{{d.text}}
						</div>
						<div class="comment-content" ng-if="d.isEdit"> 
							<textarea ng-model="d.text">{{d.text}}</textarea>
							<button ng-click="editComment(d._id , d.text , '${parentId}')">Submit</button>
							<button ng-click="d.isEdit = false">Cancel</button>
						</div>
					</div>

					<div class="comment-box view-replies" style="box-shadow: initial;">
						<span ng-click="loadReply(d._id)" class="pc" >view replies</span>
						<span class="ml40 pc" ng-if="!d.replyButtonHidden" ng-click="d.replyButtonHidden = true">reply</span>
					</div>
					<div class="comment-box view-replies" style="box-shadow: initial;padding: 0" ng-if="d.replyButtonHidden"> 
						<textarea ng-model="d.reply"></textarea>
						<button style="padding: 5px ; border: 1px solid" ng-click="saveReply(d.reply,d._id) ; d.reply = null ; d.replyButtonHidden = false">submit</button>
					</div>
					</div>
				</li></ul>`
	}
	var showPopup = function(msg){
		$mdToast.show(
	        $mdToast.simple()
	        .textContent(msg)
	        .position('top right')
	        .hideDelay(3000)
	    )
	} 

	$scope.addComment = function(){
		if(!$scope.text){
			showPopup('Enter Comment First')
			return
		}
		if(!$cookies.get('x-access-token')){
			$scope.openLoginDialog()
		} else {
			QueryService.query('POST',{'x-access-token' : $cookies.get('x-access-token')},CONSTANTS.comment,{},{
				text : $scope.text ,
				postId : $scope.post._id 
			})
			.then(function(res){
				init();
				showPopup('Comment Posted')
				// $scope.post = res.data ;
			})
			.catch(function(err){
				showPopup(err.data.error)
			})
		}
	}

	init()

})

.controller('postController', function($scope,$sce,CONSTANTS,$cookies,$window,$timeout,$mdToast,QueryService,$mdDialog,$state) {
	
	var init = function(){
		QueryService.query('GET',{},CONSTANTS.getAllPosts,{},{})
		.then(function(res){
			$scope.posts = res.data ;
		})
		.catch(function(err){
			showPopup(err.data.error)
		})
	}

	$scope.addPost = function(ev) {
		var token = $cookies.get('x-access-token') ;
		if(!token){
			$scope.openLoginDialog(ev)
		} else {
			$scope.openPostDialog(ev)
		}
	};

	var showPopup = function(msg){
		$mdToast.show(
	        $mdToast.simple()
	        .textContent(msg)
	        .position('top right')
	        .hideDelay(3000)
	    )
	} 

	$scope.postClick = function(id){
		console.log(id);
		$state.go('home.post',{id: id})
	}

	$scope.openPostDialog = function(ev){
		$mdDialog.show({
	        controller: PostDialogController,
	        templateUrl: 'Add.PostDialog.html',
	        targetEvent: ev,
	        clickOutsideToClose:true
	    })
	}

	function PostDialogController($cookies , $scope, $mdDialog) {
		console.log('here');

		$scope.savePost = function(){
			QueryService.query('POST',{'x-access-token' : $cookies.get('x-access-token')},CONSTANTS.post,{},{text : $scope.text , topic : $scope.topic})
			.then(function(res){
				showPopup('Post Successfully Created')
				init()
				$mdDialog.cancel();
			})
			.catch(function(err){
				showPopup(err.data.error)
			})
		}
	};

	init()

});