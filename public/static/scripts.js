var app = angular.module("ssc", []);

app.controller("LikesCtrl", function($scope, $http) {

	$scope.topicId = 1660101;
	$scope.lastPage = 665;

	$scope.currentPage = 0;

	$scope.results = [];

	$scope.fetch = function() {
		$scope.results = [];
		$scope.currentPage = $scope.lastPage;

		async.until(function() {
			return $scope.currentPage < 1;
		}, function(callback) {
			$http({
				method: "GET",
				url: "likes.json?page="+$scope.currentPage+"&topic="+$scope.topicId
			}).then(function(response) {
				$scope.results = $scope.results.concat(response.data);
			}, function() {
				console.log("ERROR");
			}).finally(function() {
				$scope.results.sort(function(a, b) {
					return b.likes - a.likes;
				});
				$scope.currentPage--;
				callback();
			});
		}, function(err) {
			if(err) {
				console.log(err);
			}

			$scope.results.sort(function(a, b) {
				return b.likes - a.likes;
			});
		});
	};


});