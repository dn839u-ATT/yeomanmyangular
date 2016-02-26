/**
 * Created by dn839u on 2/1/2016.
 */
angular.module('myangularApp.services',[]).factory('Movie',function($resource){
  return $resource('http://localhost:3000/api/movies/:id',{id:'@_id'},{
    update: {
      method: 'PUT'
    }
  });
}).service('popupService',function($window){
  this.showPopup=function(message){
    return $window.confirm(message);
  }
})
.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(){
      })
      .error(function(){
      });
  }
}]);
