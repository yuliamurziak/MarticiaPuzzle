// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kittyApp', ['ionic'])
.controller('kittyctrl', function($scope, $http) {
  $scope.model={};
  $scope.answers = []; 
  $scope.userAnswers=[];
  $scope.optionvalues=["A","B","C","D","E","F","G","H","I","J","K","L","M","N"];
  var dbSize = 5 * 1024 * 1024; // 5MB
 /// open database
 var db = openDatabase("kittyApp", "1", "Marticia's Puzzle", dbSize);
 var insertValues = ["C","L","F","B","G","H"];


 $scope.isObjectEmpty = function(card){
  return Object.keys(card).length === 0;
}

 $scope.calculate=function()
 {
  
   $scope.userAnswers=[$scope.one,$scope.two,$scope.three,$scope.four,$scope.five,$scope.six];
      console.log($scope.userAnswers);
     
      
   $scope.compareResults();
 }
 
 
$scope.compareResults=function()
{
  var rightAnswers=0;
  for(var i=0; i<$scope.answers.length; i++)
  {
    if($scope.answers[i] == null){
      document.getElementById("messageResult").innerHTML="Please, fill all fields!";
    }
    if($scope.answers[i]==$scope.userAnswers[i])
    {
      rightAnswers++;
    }
  }
  if(rightAnswers==6){
    document.getElementById("messageResult").innerHTML="Yeeaaahhh!!! Marticia is happy!!!";
    var adioSRC=document.getElementById("audio").src = "sounds/goodSound.mp3";
    var audio = document.getElementById("audio");
    audio.play();
  }else{
    document.getElementById("messageResult").innerHTML="Oops .. No, you are wrong! Try one more time to satisy Marticia";
   var adioSRC=document.getElementById("audio").src = "sounds/badNoise.mp3";
    var audio = document.getElementById("audio");
    audio.play();
    
  }
  //alert("You have got "+rightAnswers+" right of 6")
}

$scope.addCorrectAnswers= function(){
  db.transaction(function(tx) {
    tx.executeSql('DROP TABLE  IF EXISTS rightAnswers',[],function(){},function(){});
    });
    
    db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE  IF NOT EXISTS rightAnswers (ID int PRIMARY KEY, Letter TEXT)',[],function(){},function(){});
      });
      
        db.transaction(function(tx) {
          for(i=0;i<insertValues.length;i++)
          {    
          tx.executeSql('INSERT INTO rightAnswers(ID,Letter) VALUES (?,?)',
            [i+1,insertValues[i]],function(){
              console.log("success");
            },function(){
              console.log("fail");              
            });
          } 
          
        });
        
         $scope.readCorrectAnswers();
}

$scope.readCorrectAnswers = function()
{
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM rightAnswers", [], 
          function(tx, rs)
          {
            $scope.answers = []; // array of right answers
            for(var n = 0; n < rs.rows.length; n++)
            {
                $scope.answers.push(rs.rows.item(n).Letter);
            }
            $scope.$apply();
          },
          function(err)
          {
            console.log(err);
          });
    });    
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
