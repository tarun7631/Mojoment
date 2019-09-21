angular.module('rentomojoDirectives', [])
.directive("httpRequestLoader",["$http",function($http){
	return{
		restrict:"E",
		template:'<div class="loading-head"><div class="loading-icon"></div><div>',
		link:function(scope,element,attrs){
			scope.isLoading=function(){
				return $http.pendingRequests.length>0},
				scope.$watch(scope.isLoading,function(value){value?element.removeClass("ng-hide"):element.addClass("ng-hide")})
			}
		}
	}
]);