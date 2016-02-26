/**
 * Created by dn839u on 2/1/2016.
 */
angular.module('myangularApp.controllers', []).controller('MovieListController', function($scope,$http, $state,$sce, popupService, $window, Movie) {
  $scope.movies = Movie.query(); //fetch all movies. Issues a GET to /api/movies


  // The function that will be executed on button click (ng-click="search()")
  $scope.search = function() {
   /* $scope.url = 'http://localhost:3000/api/movies?movieTitle='+$scope.keywords; // The url of our search
    // Create the http post request
    // the data holds the keywords
    // The request is a JSON request.
    //$http.post($scope.url, { "data" : $scope.keywords}).
    $http.get($scope.url).
      success(function(data, status) {
        $scope.status = status;
        $scope.data = data;
        $scope.result = data; // Show result from server in our <pre></pre> element
        $scope.movies = data;
      })
      .
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
      });*/
    $scope.movies = Movie.query( {title:$scope.keywords});
    $scope.result = Movie.query( {title:$scope.keywords});


  };

  $scope.playVideo = function(movieId) {
    var selector = '#' + movieId;
    $('Video').hide();
    $(selector).show();
    document.querySelector('Video[id="'+movieId + '"]').play();
  }

  $scope.deleteMovie = function(movie) { // Delete a movie. Issues a DELETE to /api/movies/:id
    if (popupService.showPopup('Really delete this?')) {
      movie.$delete(function() {
        $window.location.href = ''; //redirect to home
      });
    }
  };
}).controller('MovieViewController', function($scope, $stateParams, Movie) {
  $scope.movie = Movie.get({ id: $stateParams.id }); //Get a single movie.Issues a GET to /api/movies/:id
}).controller('MovieCreateController', function($scope, $state, $stateParams, Movie) {
  $scope.movie = new Movie();  //create new movie instance. Properties will be set via ng-model on UI

  $scope.addMovie = function() { //create a new movie. Issues a POST to /api/movies
    var file = $scope.myFile;
    var Name = file.name;
    var socket = io.connect('http://localhost:3000');
    console.log('file is ', file );
    if(typeof(file) != "undefined")
    {
      FReader = new FileReader();
      //Name = document.getElementById('NameBox').value;
      var Content = "<span id='NameArea'>Uploading "+ file.name + " as " + file.name + "</span>";
      Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
      Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(file.size / 1048576) + "MB</span>";
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function(evnt){
        socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
      }
      socket.emit('Start', { 'Name' : Name, 'Size' : file.size });

      socket.on('MoreData', function (data){
        UpdateBar(data['Percent']);
        var Place = data['Place'] * 524288; //The Next Blocks Starting Position
        var NewFile; //The Variable that will hold the new Block of Data
        if(file.webkitSlice)
          NewFile = file.webkitSlice(Place, Place + Math.min(524288, (file.size-Place)));
        else
          NewFile = file.slice(Place, Place + Math.min(524288, (file.size-Place)));
        FReader.readAsBinaryString(NewFile);
      });
      function UpdateBar(percent){
        document.getElementById('ProgressBar').style.width = percent + '%';
        document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
        var MBDone = Math.round(((percent/100.0) * file.size) / 1048576);
        document.getElementById('MB').innerHTML = MBDone;
      }

      var Path = "http://localhost/";

      socket.on('Done', function (data){
        var Content = "Video Successfully Uploaded !!"
        Content += "<img id='Thumb' src='" + Path + data['Image'] + "' alt='" + Name + "'><br>";
        Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
        document.getElementById('UploadArea').innerHTML = Content;
        document.getElementById('Restart').addEventListener('click', Refresh);
        //document.getElementById('UploadBox').style.width = '270px';
        //document.getElementById('UploadBox').style.height = '270px';
        //document.getElementById('UploadBox').style.textAlign = 'center';
        document.getElementById('Restart').style.left = '20px';
        $scope.movie.path = file.name;

        //actual save function in mongodb
        $scope.movie.$save(function() {
          $state.go('movies'); // on success go back to home i.e. movies state.
       });
      });
      function Refresh(){
        location.reload(true);
      }


    }
    else
    {
      alert("Please Select A File");
    }
  };
  $scope.uploadFile = function(){
    var file = $scope.myFile;
    console.log('file is ', file );
    console.dir(file);

    if(file != "")
    {
      FReader = new FileReader();
      //Name = document.getElementById('NameBox').value;
      var Content = "<span id='NameArea'>Uploading "+ file + " as " + file + "</span>";
      Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
      Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(file.size / 1048576) + "MB</span>";
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function(evnt){
        socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
      }
      socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size });
    }
    else
    {
      alert("Please Select A File");
    }
    var uploadUrl = "/fileUpload";
    fileUpload.uploadFileToUrl(file, uploadUrl);
  };
}).controller('MovieEditController', function($scope, $state, $stateParams, Movie) {
  $scope.updateMovie = function() { //Update the edited movie. Issues a PUT to /api/movies/:id
    $scope.movie.$update(function() {
      $state.go('movies'); // on success go back to home i.e. movies state.
    });
  };

  $scope.loadMovie = function() { //Issues a GET request to /api/movies/:id to get a movie to update
    $scope.movie = Movie.get({ id: $stateParams.id });
  };

  $scope.loadMovie(); // Load a movie which can be edited on UI
});/*.controller('SearchCtrl', function($scope, $http) {
  $scope.url = 'http://localhost:3000/api/movies?movieTitle='+$scope.keywords; // The url of our search

  // The function that will be executed on button click (ng-click="search()")
  $scope.search = function() {

    // Create the http post request
    // the data holds the keywords
    // The request is a JSON request.
    //$http.post($scope.url, { "data" : $scope.keywords}).
    $http.get($scope.url).
      success(function(data, status) {
        $scope.status = status;
        $scope.data = data;
        $scope.result = data; // Show result from server in our <pre></pre> element
      })
      .
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
      });
  };
});*/

/*.controller('MovieUploadController', function($scope, $upload) {

$scope.uploadFile = function(){

  $scope.fileSelected = function(files) {
    if (files && files.length) {
      $scope.file = files[0];
    }

    $upload.upload({
        url: '/api/upload', //node.js route
        file: $scope.file
      })
      .success(function(data) {
        console.log(data, 'uploaded');
      });

  };
};
});*/
