/**
 * Created by dn839u on 2/22/2016.
 */

// Setup the filter
angular.module('myangularApp').filter('videoPath', function($sce) {
  // Create the return function
  // set the videoFileName and frame the complete path of the Video in the node
  return function(videoFileName) {
    return $sce.trustAsResourceUrl('http://localhost:3000/Video/' + videoFileName);
  }
});
