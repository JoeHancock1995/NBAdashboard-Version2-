$(document).ready(function() {
$('select').formSelect();
var sound = new Audio();

function search() {
    event.preventDefault();
    sound.pause();  
    city = $("#city-input").val();

    var sportURL = "https://www.balldontlie.io/api/v1/teams";

    $.ajax({
        url: sportURL, 
        method: "GET"
    })
    .then(function(response) {
        var results = response;

        for (var i = 0; i < response.data.length; i++) {
            var rCity = response.data[i].city;
            if (city == rCity) {
                var j = i;
            }
        }
        var id = response.data[j].id;
        var logo = $("<img>");
        $("#teamName").html("<div>" + response.data[j].full_name + "</div>");
        $(logo).attr("src", "assets/images/" + response.data[j].abbreviation + ".jpg");
        $(logo).css("height", "200px");
        $(logo).css("width", "250px");
        $("#teamName").append(logo);
        $("#teamCity").html("<div>" + response.data[j].city + " - " + response.data[j].abbreviation + "</div>");

        getGames(id);
        getPlayer(response.data[j].abbreviation);
        getWeather(city);
    });
};

function getGames(a) {
    var id = a;
    var gamesURL = "https://www.balldontlie.io/api/v1/games?seasons[]=2018&per_page=100&team_ids[]=" + id;
    $.ajax({
        url: gamesURL,
        method: "GET"
    })
    .then(function(response) {
        $("#games").html("");
        
        for (var i = 81; i > 71; i--) {
            var aDiv = $("<div>").append(
                $("<p>").text("Home: " + response.data[i].home_team.full_name),
                $("<p>").text(response.data[i].home_team_score)
            );

            var bDiv = $("<div>").append(
                $("<p>").text("Visitor: " + response.data[i].visitor_team.full_name),
                $("<p>").text(response.data[i].visitor_team_score)
            );

            if (response.data[i].home_team_score > response.data[i].visitor_team_score) {
                aDiv.css("font-weight", "bold");
                aDiv.css("color", "red");
            } else {
                bDiv.css("font-weight", "bold");
                bDiv.css("color", "red");
            }

            var date = response.data[i].date;
            date = date.substring(0 , 10);
            var cDiv = $("<div>").append(
                $("<p>").text(date),
                aDiv,
                bDiv
            );

            cDiv.attr("id", "gDiv");
            $("#games").append(cDiv);
        }
    });
};

function getPlayer(a) {
    var abb = a.toLowerCase(); 
    var playerURL = "https://nba-players.herokuapp.com/players-stats-teams/" + abb;
    $.ajax({
        url: playerURL,
        method: "GET"
    })
    .then(function(response) {
        $("#players").html("");
        for (var i = 0; i < response.length; i++) {
            var name = response[i].name;
            var nameSplit = name.split(" ");
            var first = nameSplit[0];
            var last = nameSplit[1];
            var pFirst = onlyLetters(first);
            var pLast = onlyLetters(last);

            var newRow = $("<div>");
            var p = $("<span>").text(first + " " + last);
            $(p).attr("id", "playerName");
            var pic = $("<img>");
            $(pic).attr("src", "https://nba-players.herokuapp.com/players/" + pLast + "/" + pFirst);
            $(pic).attr("id", "playerPic");
            $(pic).on("error", function () {
                $(this).attr("src", "assets/images/noPic.png");
            });

            $(newRow).append(pic);
            $(newRow).append(p);
            $(newRow).attr("id", "player");
            $(newRow).css("float", "left");
            $(newRow).css("margin", "0 20px 20px 0");
            $(newRow).attr("class", "carousel-item");

            $("#players").append(newRow); 
            $('.carousel').carousel();     
        }
    });
};

function onlyLetters(b) {
    var a = b.toLowerCase();
    var c = [];
    
    for (var i = 0; i < a.length; i++) {
        if ((a.charCodeAt(i) >= 97 && a.charCodeAt(i) <= 122) || (a.charCodeAt(i) == 45)) {
            c[i] = a[i]; 
        }
    }
    return c.join("");
}

function getWeather(city) {
    var wCity = city;

    if (city === "Golden State") {
        wCity = "Oakland";
    } else if (city === "Indiana") {
        wCity = "Indianapolis";
    } else if (city === "LA") {
        wCity = "Los Angeles";
    } else if (city === "Minnesota") {
        wCity = "Saint Paul";
    } else if (city === "Utah") {
        wCity = "Salt Lake City";
    }
 
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + wCity + ",us&appid=053d4bb7502bca3c24eeb2d48eeeda6e";

    if (wCity === "Toronto") {
        weatherURL = "https://api.openweathermap.org/data/2.5/forecast?q=Toronto,ca&appid=053d4bb7502bca3c24eeb2d48eeeda6e";
    }
    
    $.ajax({
        url: weatherURL,
        method: "GET"
    })
    .then(function(response) {
        var results = response;
        $("#weather-API").html("");
        var countD = 0;
        for (var i = 0; i < 24; i = i + 5) {
            var day = moment().add(countD, 'days');
            var longD = moment(day).format('dddd');
            var date = moment(day).format("MMM Do YY");
            countD++;
            //(299K − 273.15) × 9/5 + 32 = 78.53°F
            var temp = (response.list[i].main.temp - 273.15) * (9/5) + 32;
            temp = parseInt(temp); 
            
            var newRow = $("<li>");
            var cHead = $("<div>");
            $(cHead).attr("class", "collapsible-header");
            $(cHead).html("<i class='material-icons'>" + "filter_drama" + "</i>" + longD + ", " + date);

            var cBody = $("<div>");
            $(cBody).attr("class", "collapsible-body");

            $(cBody).append(
                $("<p>").text(temp),
                $("<p>").text(response.list[i].weather[0].main),
                $("<p>").text(response.list[i].weather[0].description)
            )

            var pic = $("<img>");
            var test = response.list[i].weather[0].main;
            
            var test = test.toLowerCase(); 
            if (test == "clear") {
                $(pic).attr("src", "assets/images/wclear.jpg");
            } else if (test == "clouds") {
                $(pic).attr("src", "assets/images/wclouds.jpg");
            } else if (test == "partly cloudy") {
                $(pic).attr("src", "assets/images/wpartlycloudy.jpg");
            } else if (test == "rain") {
                $(pic).attr("src", "assets/images/wrain.jpg");
            } else if (test == "storms") {
                $(pic).attr("src", "assets/images/wstorms.jpg");
            } else {
                $(pic).attr("src", "assets/images/wclouds.jpg");
            }
            $(cBody).append(pic);
            $(newRow).append(cHead);
            $(newRow).append(cBody);
            
            $("#weather-API").append(newRow);
            $('.collapsible').collapsible();
        }
    }); 
}

function spaceJam() {
    event.preventDefault();
    //Music
    sound.src = "assets/images/spaceJam/spacejam.aac";
    sound.currentTime = 0;  
    sound.play();

    //Team
    var logo = $("<img>");
    $("#teamName").html("<div>" + "Tune Squad" + "</div>");
    $(logo).attr("src", "assets/images/spaceJam/spacejam.png");
    $(logo).css("height", "200px");
    $(logo).css("width", "250px");
    $("#teamName").append(logo);
    $("#teamCity").html("<div>" + "Tune Town" + "</div>");

    //Weather
    $("#weather-API").html("");
    var longD = moment().format('dddd');
    var date = moment().format("MMM Do YY");

    var newRow = $("<li>");
    var cHead = $("<div>");
    $(cHead).attr("class", "collapsible-header");
    $(cHead).html("<i class='material-icons'>" + "filter_drama" + "</i>" + longD + ", " + date);

    var pic = $("<img>");
    $(pic).attr("src", "assets/images/wclear.jpg");
                
    var cBody = $("<div>");
    $(cBody).attr("class", "collapsible-body");
    $(cBody).append(
        $("<p>").text("Perfect Temperature"),
        $("<p>").text("Perfect Weather"),
        $("<p>").text("Clear Skies")
    )
    $(cBody).append(pic);
    $(newRow).append(cHead);
    $(newRow).append(cBody);
            
    $("#weather-API").append(newRow);
    $('.collapsible').collapsible();
    
    //Games
    $("#games").html("");
    var aDiv = $("<div>").append(
        $("<p>").text("Home: " + "Tune Squad"),
        $("<p>").text("78")
    );

    var bDiv = $("<div>").append(
        $("<p>").text("Visitor: MONSTARS"),
        $("<p>").text("77")
    );

    aDiv.css("font-weight", "bold");
    aDiv.css("color", "red");
    

    var date = "November 15, 1996";
    var cDiv = $("<div>").append(
        $("<p>").text(date),
        aDiv,
        bDiv
    );

    cDiv.attr("id", "gDiv");
    $("#games").append(cDiv);

    //Players
    $("#players").html("");
    var name = ["Michael Jordan", "Bugs Bunny", "Lola Bunny", "Daffy Duck",
    "Tasmanian Devil", "Tweety", "Foghorn", "Porky Pig", "Yosemite Sam",
    "Sylvester", "Pepé Le Pew", "Emma Webster", "Wayne Knight",
    "Bill Murray", "Elmer Fudd"];

    for (var i = 0; i < name.length; i++) {
        var newRow = $("<div>");
        var p = $("<span>").text(name[i]);
        $(p).attr("id", "playerName");
        var pic = $("<img>");
        $(pic).attr("src", "assets/images/spaceJam/" + i + ".png");
        $(pic).attr("id", "playerPic");
        $(pic).css("width", "350px");
        $(pic).css("height", "250px");

        $(newRow).append(pic);
        $(newRow).append(p);
        $(newRow).attr("id", "player");
        $(newRow).css("float", "left");
        $(newRow).css("margin", "0 20px 20px 0");
        $(newRow).attr("class", "carousel-item");

        $("#players").append(newRow); 
        $('.carousel').carousel();     
    }
}


$(document).on("click", "#spaceJam", spaceJam);

$(document).on("click", "#submit", search);
});

