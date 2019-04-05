function createMap(trendLocMarkers) {

    //Create the base layers that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 10,
        minZoom:2,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    //var votes = createVoters();


    var states = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 4,
        minZoom:2,
        //minZoom:10,
        id: "mapbox.states",
        accessToken: API_KEY
    });

    // var demographics1 = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    //     maxZoom: 4,
    //     id: "mapbox.demographics1",
    //     accessToken: API_KEY
    // });


    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "States": states,
        "Light": lightmap
        //"Voters": ChoroMap

    };

    // Create an overlayMaps object to hold the trend location layer
    var overlayMaps = {
        "Trend Locations": trendLocMarkers

    };

    // Create the map object with options
    var map = L.map("map", {
        center: [38.381266, -97.922211],
        zoom: 4,
        layers: [states, trendLocMarkers]
    });

    //   Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);

    var statesData = "https://raw.githubusercontent.com/Euzkaro/project2.io/master/state-demgraphics.json"
    var votes = d3.json(statesData, function (data) {

        // Create a new choropleth layer
        geojson = L.choropleth(data, {

            // Define what  property in the features to use
            valueProperty: "Democrat",

            // Set color scale  
            scale: ["#c60b0b", "#2b0bc6"],

            // Number of breaks in step range
            steps: 5,
            maxZoom: 10,
            minZoom:2,
            // q for quartile, e for equidistant, k for k-means
            mode: "q",
            style: {
                // Border color
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8
            }

            //     // Binding a pop-up to each layer
            //         onEachFeature: function(feature, layer) {
            //           layer.bindPopup("<h1>" + feature.properties.name + "</h1>" + "Population: " + feature.properties.Population + "<br> Democrat Voters:<br>" +
            //              feature.properties.Democrat + "%");
            //         }
        }).addTo(map);

        // Set up the legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend");
            var limits = geojson.options.limits;
            var colors = geojson.options.colors;
            var labels = [];

            // Add min & max
            var legendInfo = "<h4>Political Leaning (%)</h4>" +
                "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
                "</div>";

            div.innerHTML = legendInfo;

            limits.forEach(function (limit, index) {
                labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
            });

            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };

        // Adding legend to the map
        //legend.addTo(map);

    });

    //##################################################################################
    //   //GeoData State Level
    //##################################################################################

    var statesData = "https://raw.githubusercontent.com/Euzkaro/project2.io/master/state-demgraphics.json"

    // //   Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    // }).addTo(map);

    // Add information to states layer
    // Grabbing our GeoJSON data..
    d3.json(statesData, function (data) {
        // Creating a geoJSON layer with the retrieved data
        L.geoJson(data, {
            style: {
                fillOpacity: 0.0,
                color: "white",
                weight: 1
            },
            // Called on each feature
            onEachFeature: function (feature, layer) {
                // Set mouse events to change map styling
                layer.on({
                    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                    mouseover: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.9,
                            color: "#4E2A84"
                        });
                    },
                    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                    mouseout: function (event) {
                        layer = event.target;
                        layer.setStyle({
                            fillOpacity: 0.00,
                            color: "#fff"//"#4E2A84"
                        });
                    },
                    // When a feature (state) is clicked, it is enlarged to fit the screen
                    click: function (event) {
                        map.fitBounds(event.target.getBounds());
                    }
                });
                // Giving each feature a pop-up with information pertinent to it
                layer.bindPopup("<h1>" + feature.properties.name +
                    "<h4>" + "ranks: " + "<h3 style=\"color:#4E2A84\"><b>" + feature.properties.Twitter_rank + "/51 </b></h3> by number of active users in the US </h4>" +
                    "</h1> <hr> <p>Population: " +
                    feature.properties.Population +
                    "<br> Republican Voters (%): " + feature.properties.Republican +
                    "<br> Democrat Voters (%): " + feature.properties.Democrat +
                    "<br> College Graduates (%): " + feature.properties.BachelorDegree +
                    "<br> High School Graduates (%): " + feature.properties.HighSchool +
                    // "<br> Whites (%): " + feature.properties.White +
                    // "<br> Blacks (%): " + feature.properties.Black +
                    // "<br> Asians (%): " + feature.properties.Asian +
                    // "<br> Latinos (%): " + feature.properties.Latino +
                    // "<br> Natives (%): " + feature.properties.Native +
                    "<br> Unemployment (%): " + feature.properties.Unemployment +
                    "<br> Median Income Household ($): " + feature.properties.MHI +
                    "</p>");
            }
        }).addTo(map);
    });
};
// //######################################################################################
// // Choropleth
// //######################################################################################
// // Link to GeoJSON
// 

// function createVoters() {
//     var statesData = "https://raw.githubusercontent.com/Euzkaro/project2.io/master/state-demgraphics.json"
//     var votes = d3.json(statesData, function (data) {

//         // Create a new choropleth layer
//         geojson = L.choropleth(data, {

//             // Define what  property in the features to use
//             valueProperty: "Black",

//             // Set color scale  
//             scale: ["#c60b0b", "#2b0bc6"],

//             // Number of breaks in step range
//             steps: 10,

//             // q for quartile, e for equidistant, k for k-means
//             mode: "q",
//             style: {
//                 // Border color
//                 color: "#fff",
//                 weight: 1,
//                 fillOpacity: 0.8
//             }

//         //     // Binding a pop-up to each layer
//         //         onEachFeature: function(feature, layer) {
//         //           layer.bindPopup("<h1>" + feature.properties.name + "</h1>" + "Population: " + feature.properties.Population + "<br> Democrat Voters:<br>" +
//         //              feature.properties.Democrat + "%");
//         //         }
//         });//.addTo(map);

//         // // Set up the legend
//         // var legend = L.control({ position: "bottomright" });
//         // legend.onAdd = function () {
//         //     var div = L.DomUtil.create("div", "info legend");
//         //     var limits = geojson.options.limits;
//         //     var colors = geojson.options.colors;
//         //     var labels = [];

//         //     // Add min & max
//         //     var legendInfo = "<h1>Democrat Voters (%)</h1>" +
//         //         "<div class=\"labels\">" +
//         //         "<div class=\"min\">" + limits[0] + "</div>" +
//         //         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//         //         "</div>";

//         //     div.innerHTML = legendInfo;

//         //     limits.forEach(function (limit, index) {
//         //         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//         //     });

//         //     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//         //     return div;
//         // };

//         // // Adding legend to the map
//         // legend.addTo(map);

//     });
//     return (votes);
// };


//######################################################################################
function createMarkers(data) {

    // Pull the "name" property off of data
    //var locations = data.name;

    // marker setup
    var BubbleIcon = L.Icon.extend({
        options: {
            iconSize: [27, 27],
            iconAnchor: [15, 50],
            popupAnchor: [-3, -76]
        }
    });

    var greenIcon = new BubbleIcon({ iconUrl: 'static/images/MapMarker_Bubble_Green.png' });
    var whiteIcon = new BubbleIcon({ iconUrl: 'static/images/MapMarker_Bubble_White.png' });
    var redIcon = new BubbleIcon({ iconUrl: 'static/images/MapMarker_Bubble_Red.png' });
    var blueIcon = new BubbleIcon({ iconUrl: 'static/images/MapMarker_Bubble_Blue.png' });
    var azureIcon = new BubbleIcon({ iconUrl: 'static/images/MapMarker_Bubble_Azure.png' });
    var orangeIcon = new BubbleIcon({ iconUrl: 'static/images//MapMarker_Bubble_Orange.png' });
    var TwitterIcon = new BubbleIcon({iconUrl:'static/js/twitter-marker.png'});

    // Initialize an array to hold trend location markers
    var trendLocMarkers = [];

    // Loop through the sample location array
    for (var index = 0; index < data.length; index++) {
        var location = data[index];

        // For each location, create a marker and bind a popup with the location name
        var locationMarker = L.marker([location.latitude, location.longitude], { icon: TwitterIcon })
            .bindPopup("<h3>" + location.name_only + "<h3><h3 class=\"locate\" id=\"" + location.woeid + "\">" + location.state_name_only + "<h3>")
            .on('click', d => {

                var el = document.createElement('html');
                el.innerHTML = d.target._popup._container;
                var woeid = d.target._popup._container.getElementsByClassName('locate')[0].getAttribute('id');

                console.log(woeid);

                buildLocTable(woeid);

                // const proxyurl = "https://cors-anywhere.herokuapp.com/";
                // const url = `https://geotweetapp.herokuapp.com/trends/top/${woeid}`;
                // const fields = ["twitter_name", "twitter_tweet_name", "twitter_tweet_url", "twitter_tweet_volume"]

                // d3.json(proxyurl + url, function (tableData) {
                //     console.log(tableData);

                //     // Get a reference to the table body
                //     var tbody = d3.select("tbody");
                //     console.log(tbody.html());
                //     tbody.html("");
                //     console.log(tbody.html());
                //     // Loop through data and append one table row `tr` for each object
                //     tableData.forEach((locTrend) => {
                //         var row = tbody.append("tr");
                //         // Append data elements `td` for each object and enter data values
                //         //   Object.entries(locTrend).forEach(([key, value]) => {
                //         fields.forEach(f => {
                //             var cell = tbody.append("td");
                //             cell.text(locTrend[f]);
                //         });
                //         // var cell = tbody.append("td");
                //         // cell.text(value);
                //     });
                // });
            });
    

        // Add the marker to the location Markers array
        trendLocMarkers.push(locationMarker);
        // console.log(trendLocMarkers);
    };

    // Create a layer group made from the location markers array, pass it into the createMap function
    createMap(L.layerGroup(trendLocMarkers));
};


// Load up the states demographics data as a list of objects
// createAllDemographicsCharts([ "Georgia", "Alabama", "Ohio", "Illinois", "Michigan", "California", "New York", "Texas" ]);

// Retrieve data from sample data file and call marker function
// var locationData = trendLocations;

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = `https://geotweetapp.herokuapp.com/locations`;

d3.json(proxyurl + url, function (locationData) {
    createMarkers(locationData);
});
