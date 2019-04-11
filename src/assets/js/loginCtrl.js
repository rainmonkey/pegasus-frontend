app.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
    //declare submit event, To ng-submit in html
    $scope.submit = function() {
      //http serves POST username and password
      $http({
          method: 'POST',
          url: 'your url',
          params: {
            "username": $scope.username, //ng-model Two-way binding username
            "password": $scope.password //ng-model Two-way binding password
          }, 
        })
        .success(function(data) {				
          if (data.result === 'success') {			
            window.location.href = 'index.html#/index'; //login success
          } else {					
            alert("error"); //login fail
          }					
        })
        //contect error
        .error(function() {
          alert("connecting fail");
        });
    };
  }]);