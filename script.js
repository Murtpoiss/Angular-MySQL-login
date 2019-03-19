
var routeApp = angular.module('main', ['ngRoute']);

routeApp.config(function($routeProvider, $locationProvider) {
	
	$routeProvider.when('/', {
		templateUrl: './components/home.html',
		controller: 'homeCtrl'
	}).when('/logout', {
		resolve: {
			deadResolve: function($location, user) {
				user.clearData();
				$location.path('/');
			}
		}
	}).when('/login', {
		templateUrl: './components/login.html',
		controller: 'loginCtrl'
	}).when('/register', {
		templateUrl: './components/register.html',
		controller: 'registerCtrl'
	}).when('/notify', {
		templateUrl: './client/index.html'
	}).when('/dashboard', {
		resolve: {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
					$location.path('/login');
				}
			},
		},
		templateUrl: './components/dashboard.html',
		controller: 'dashboardCtrl'
	})
	.otherwise({
		template: '404'
	});
	$locationProvider.html5Mode(true);
});

routeApp.controller('homeCtrl', function($scope, $location) {
	$scope.goToLogin = function() {
		$location.path('/login');
	};
	$scope.goToRegister = function() {
		$location.path('/register');
	};
	$scope.notifyMe = function() {
		$location.path('/notify');
	};
});

routeApp.service('user', function() {
	var username;
	var loggedin = false;
	var id;

	this.getName = function() {
		return username;
	};

	this.setID = function(userID) {
		id = userID;
	};
	this.getID = function() {
		return id;
	};

	this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('login')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('login'));
			username = data.username;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		username = data.user;
		id = data.id;
		loggedin = true;
		localStorage.setItem('login', JSON.stringify({
			username: username,
			id: id
		}));
	};

	this.clearData = function() {
		localStorage.removeItem('login');
		username = "";
		id = "";
		loggedin = false;
	};
});

routeApp.controller('loginCtrl', function($scope, $http, $location, user) {
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://localhost/uus-proov-yhendada/angularjs-mysql/server.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function(response) {
			if(response.data.status == 'loggedin') {
				user.saveData(response.data);
				$location.path('/dashboard');
			} else {
				alert('invalid login');
			}
		});
	};
});

routeApp.controller('registerCtrl', function($scope, $http, $location, user) {
	$scope.registerNow = function() {
		var username = $scope.firstusername;
		var password = $scope.firstpassword;
		$http({
			url: 'http://localhost/uus-proov-yhendada/angularjs-mysql/register.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function(response) {
			if(response.data.status == 'loggedin') {
				user.saveData(response.data);
				$location.path('/dashboard');
			} else {
				alert('Registration Error');
			}
		});
	};
});

routeApp.controller('dashboardCtrl', function($scope, $http, $location, user) {
	$scope.user = user.getName();
	
	$scope.newPass = function() {
		var password = $scope.newpassword;
		var userID = user.getID();
		$http({
			url: 'http://localhost/uus-proov-yhendada/angularjs-mysql/updatePass.php',
			method: 'POST',
			processData: false,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'newpassword='+password+'&username='+$scope.user+'&userID='+userID
		}).then(function(response) {
			if(response.data.status == 'done') {
				alert('Password updated');
				$location.path('/login');
			} else {
				alert('Status is: ' + response.data.status);
			}
		}).catch(function (error) { console.error(error); });
	};

	$scope.logOut = function() {
		$location.path('/logout');
	};

});