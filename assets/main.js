var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when('/',{
        templateUrl : "Pages/home.html",
        controller : "home_controller"
    })
    .when("/search/:location", {
        templateUrl : "Pages/search.html",
        controller  : "search_controller"
    })
    .when("/details", {
        templateUrl : "Pages/details.html"
    })
    .when("/weather/:woeid",{
        templateUrl : "Pages/weatherDetails.html",
        controller : "wd_controller"
    })
})
.controller("home_controller",function($scope, $http, $routeParams){


    var locations =    ["Istanbul", "Berlin", "London", "Helsinki", "Dublin", "Vancouver"];
    var weatherData     =    new Array;
    var c         =    0;

    function ajaxify(){
        return new Promise(function(resolve,reject){
            $http({
                method:"GET",
                url:"weather.php?command=search&keyword="+locations[c],
            }).then(function(response) {
                $http.get('weather.php?command=location&woeid='+response.data[0].woeid)
                .then(function(res){
                    resolve({loc:response.data[0],data:res.data});
                })
            });
        })
    }

    function getData(){
        if(c == locations.length){
            document.getElementById("wdl-1").style.display = "none";
            document.getElementById("wds-1").style.display = "flex";
            console.log("Finsihed !");
            $scope.weatherData = weatherData;
            $scope.$apply();
            return;
        } else{
            ajaxify().then(function(data){
                weatherData.push(data);
                console.log(data);
                c++;
                getData();
            })
        }
    }

    getData();


})

.controller("search_controller",function($scope,$http,$routeParams){
      $http({
          method : "GET",
          url    : "weather.php?command=search&keyword="+$routeParams.location
      }).then(function(res){
          if(res.data.length > 0){
              $http({
                  method : "GET",
                  url : "weather.php?command=location&woeid="+res.data[0].woeid
              }).then(function(resp){
                  document.getElementById("wdl-2").style.display = "none";
                  document.getElementById("wds-2").style.display = "flex";
                  $scope.wDetails= resp.data;
                  console.log({loc:res.data[0],data:resp.data});
              })
          } else{
            document.getElementById("wdl-2").style.display = "none";
            let el = document.querySelector(".weather-data-error");
            el.style.display = "block";
            el.innerHTML = "No records found on ---<b>" + $routeParams.location + "</b>--- ! ! ! ";
          }
      })
})


.controller("wd_controller",function($scope,$http,$routeParams){

    $http({
        method:"GET",
        url :'weather.php?command=location&woeid='+$routeParams.woeid,
    }).then(function(res){
        document.getElementById("wdl-2").style.display = "none";
        document.getElementById("wds-2").style.display = "flex";
        $scope.wDetails = res.data;
    })

})

app.controller("myCtrl",function($scope,$http,$routeParams){
    
    $scope.changeAction = function($event){
        $scope.loc = "#!search/"+document.getElementById("s-value").value;
    }
    
})

app.filter("formatDate",function(){
    return function(x){
        var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        var months = ["Jan", "Feb", "Mar", "April", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var day, month, year;

        return days[new Date(x).getDay()-1]+" ,"+ months[new Date(x).getMonth()] +" "+ new Date(x).getDate()+" ,"+ new Date(x).getFullYear();

    }
})