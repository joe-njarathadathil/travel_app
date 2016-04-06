function calculateRoute(from, to) {
  // Center initialized to
  var myOptions = {
    zoom: 10,
    center: new google.maps.LatLng(-87, 41),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // Draw the map
  var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: from,
    destination: to,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(
    directionsRequest,
    function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        new google.maps.DirectionsRenderer({
          map: mapObject,
          directions: response
        });
      } else
        $("#error").append("Unable to retrieve your route<br />");
    }
  );
}
$(document).ready(function() {
  // If the browser supports the Geolocation API
  if (typeof navigator.geolocation == "undefined") {
    $("#error").text("Your browser doesn't support the Geolocation API");
    return;
  }

  $("#from-link, #to-link").click(function(event) {
    event.preventDefault();
    var addressId = this.id.substring(0, this.id.indexOf("-"));

    navigator.geolocation.getCurrentPosition(function(position) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
          },
          function(results, status) {
            if (status == google.maps.GeocoderStatus.OK)
              $("#" + addressId).val(results[0].formatted_address);
            else
              $("#error").append("Unable to retrieve your address<br />");
          });
      },
      function(positionError) {
        $("#error").append("Error: " + positionError.message + "<br />");
      }, {
        enableHighAccuracy: true,
        timeout: 10 * 1000 // 10 seconds
      });
  });

  $("#calculate-route").submit(function(event) {
    event.preventDefault();
    calculateRoute($("#from").val(), $("#to").val());
  });
});
// var mainWeather = {
//   init: function() {
//     $("#submitWeather").click(function() {
//       return mainWeather.getWeather();
//     });
//   },
//
//   getWeather: function() {
//     $.get('http://api.openweathermap.org/data/2.5/weather?q=' + $("#cityInput").val() + "&units=imperial" + "&APPID=20221a6a618a155ce13c5fdd359f8096", function(data) {
//       var json = {
//         json: JSON.stringify(data),
//         delay: 1
//       };
//       echo(json);
//     });
//   },
//
//   //Prints result from the weatherapi, receiving as param an object
//   createWeatherWidg: function(data) {
//     return "<div class='pressure'> <p>Temperature: " + data.main.temp + " F</p></div>" +
//       "<div class='description'> <p>Title: " + data.weather[0].main + "</p></div>" +
//       "<div class='description'> <p>Description: " + data.weather[0].description + "</p></div>" +
//       "<div class='wind'> <p>Wind Speed: " + data.wind.speed + "</p></div>" +
//       "<div class='humidity'> <p>Humidity: " + data.main.humidity + "%</p></div>" +
//       "<div class='pressure'> <p>Pressure: " + data.main.pressure + " hpa</p></div>";
//   }
// };
//
// var echo = function(dataPass) {
//   $.ajax({
//     type: "POST",
//     url: "/echo/json/",
//     data: dataPass,
//     cache: false,
//     success: function(json) {
//       var wrapper = $("#weatherWrapper");
//       wrapper.empty();
//       wrapper.append("<div class='city'> <p>Place: " + json.name + ", " + json.sys.country + "</p></div>");
//       wrapper.append(mainWeather.createWeatherWidg(json));
//     }
//   });
// };
//
// mainWeather.init();
