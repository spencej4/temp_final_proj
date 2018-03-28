let map; //The map variable that is an instance of a google.maps.Map is local to the initialize function. 
//this forces global scope of map to be reused and initialized in further function calls
let bounds;
let markersArray = [];
// The following are used in the Wheel of Danger feature
var options = [];
var optionsDetails = [];
var arc;
var startAngle = 0;
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;
// The following are used in validation
let zipStart = 98001; 
let zipEnd = 98199; 
let zips = [];

$(window).load(function() {
    // Intialize our map
    var center = new google.maps.LatLng(47.608013, -122.335167);
    mapOptions = {
        zoom: 13,
        center: center
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // This uses both the key and value strings to build the URL
    function generateURL(searchParams) {
        let searchParamString = "";
        for (let key in searchParams) {
            // skip loop if the property is from prototype
            if (!searchParams.hasOwnProperty(key)) continue;
            if (searchParams[key].length === 0) continue;
            searchParamString = searchParamString + key + "=" + searchParams[key] + "&"
        }
        // remove the last &
        searchParamString = searchParamString.slice(0, -1);
        return ("https://data.kingcounty.gov/resource/gkhn-e8mn.json?" + searchParamString);
    }


    // Get restaurant grade when user clicks smiley face
    $('#grades li').click(function(e) {
        switch (true) {
            case this.id == "1":
                // dynamically set value of input grade (hardcoded)
                $("#inputForm").find('input[name="grade"]').val("1");
                $(this).siblings().slideUp('fast');
                break;
            case this.id == "2":
                $("#inputForm").find('input[name="grade"]').val("2");
                $(this).siblings().slideUp('fast');
                break;
            case this.id == "3":
                $("#inputForm").find('input[name="grade"]').val("3");
                $(this).siblings().slideUp('fast');
                break;
            case this.id == "4":
                $("#inputForm").find('input[name="grade"]').val("4");
                $(this).siblings().slideUp('fast');
                break;
        }
    });

    // Reset form and remove map markers
    $('#resetButton').click(function() {
        $('#inputForm')[0].reset();
        $('#grades li').slideDown("fast");
        $('#zipCodeInputField').removeClass('error').addClass('defaultInput');
        clearOverlays();
    });

    // Clear the data overalays
    function clearOverlays() {
        // remove map markers
        for (var i = 0; i < markersArray.length; i++) {
            markersArray[i].setMap(null);
        }
        myData = null; // clear data cache
        $('#contact_info').html(""); // clear the contact info
        ctx.clearRect(0, 0, 500, 500); // clear the roulette wheel
    }

    // Buid the array of zipcodes
    while(zipStart < zipEnd +1) {
        zips.push(zipStart++);
    }

    // Run input zipcode value through zips array
    function checkZip(val) {
        for (var i = 0; i < zips.length + 1; i++) {
            // zipcode match found
            if (zips.indexOf(val) > -1) { 
                $('#zipCodeInputField').removeClass('error').addClass('defaultInput');
                inputZIP = null;
                return
            }
        }
        // zipcode match not found
        $('#zipCodeInputField').addClass('error');
        alert("Please enter a valid Seattle zipcode");
        inputZIP = null;
    }
                
    // Submit form
    $("#inputForm").submit(function(e) {
        e.preventDefault(); //added to prevent form submission from reloading the page
        let inputZIP = $('#inputForm').find('input[name="searchZIP"]').val();
        let inputGrade = $('#inputForm').find('input[name="grade"]').val();
        // ZIP code is not required, but if provided, check it
        if (inputZIP !== "") {
            inputZIP = Number(inputZIP);
            checkZip(inputZIP)
        };
        // make sure the key in searchParams is a valid field in the Food Safety database
        let searchParams = {
            'zip_code': inputZIP,
            'grade': inputGrade,
        }; 
        searchURL = generateURL(searchParams);


        // Retrieve our data and create Wheel of Danger if data returned, then map it
        $.getJSON(searchURL, function(data, textstatus) {
                myData = data;
                if (myData.length > 0) { implementWheelOfDanger(myData) };
            })
            .done(function() {
                var bounds = new google.maps.LatLngBounds();
                $.each(myData, function(i, entry) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(entry.latitude, entry.longitude),
                        map: map,
                        title: entry.name
                    });
                    markersArray.push(marker);
                    bounds.extend(marker.position); //extend the bounds to include each marker's position
                    // zooms map in to marker location when user clicks marker
                    marker.addListener('click', function() {
                        map.setCenter(marker.getPosition());
                    });
                });
                // map should recenter to include every marker
                map.fitBounds(bounds);
            })
        });

    function implementWheelOfDanger(myData) {
        let randomRestaurants = [];
        let randomRestaurantsDetails = [];
        let i = 0;
        let j = 0;
        while (i < 15 && j < myData.length - 1) {
            let newIndex = Math.floor(Math.random() * myData.length);
            let newRestaurant = myData[newIndex]["name"];
            // try avoiding duplicates until we run out of restaurants, skip over rows with no 'grade'
            if (randomRestaurants.indexOf(newRestaurant) !== -1 || !('grade' in myData[newIndex])) {
                j++;
                continue;
            }
            randomRestaurants.push(newRestaurant);
            randomRestaurantsDetails.push(myData[newIndex]);
            i++;
        }
        options = randomRestaurants;
        numOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; 
        optionsDetails = randomRestaurantsDetails;
        arc = Math.PI / (options.length / 2);
        drawRouletteWheel();
        document.getElementById("spin_button").addEventListener("click", spin);
    }
})

// select one of three colors depending on index 
function getColor(index) {
    if (index % 3 === 0) {
        return '#5e795b';
    } else if (index % 3 === 1) {
        return '#edefe5';
    } else {
        return '#6e4959';
    }
};

// generate HTML for contact info summary for selected restaurant
function makeRestaurantSummaryText(randomRestaurantsDetails, index) {
    let grade = randomRestaurantsDetails[index]['grade'];
    var image_html = "";
    switch (grade) {
        case '1':
            image_html = "<img src='img/emoji_1.png' class='wheel_text'>";
            break;
        case '2':
            image_html = "<img src='img/emoji_2.png' class='wheel_text'>";
            break;
        case '3':
            image_html = "<img src='img/emoji_3.png' class='wheel_text'>";
            break;
        case '4':
            image_html = "<img src='img/emoji_4.png' class='wheel_text'>";
            break;
    };
    
    $('#contact_info').html(
        image_html + "<br>" +
        "Contact Info: <br>" +
        randomRestaurantsDetails[index]['name'] + "<br>" +
        randomRestaurantsDetails[index]['address'] + "<br>" +
        randomRestaurantsDetails[index]['city'] + ", WA " +
        randomRestaurantsDetails[index]['zip_code'] + "<br>" +
        randomRestaurantsDetails[index]['phone'] + "<br>"
    );
};

// Function that draws a roulette wheel and arrow
// This is a modified version of code found at https://codepen.io/barney-parker/pen/OPyYqy
function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        ctx.font = 'bold 12px Helvetica, Arial';

        for (var i = 0; i < numOptions.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = getColor(i);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = numOptions[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
};

// generate initial conditions for spinning roulette wheel then start wheel spin
function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 10 * 1000;
    rotateWheel();
};

// spin wheel using initial conditions until time to stop
function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 5);
};

// stop wheel rotation, get index of place in array representing selected spot on wheel,
// then generate HTML to summarize selected restaurant
function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var text = options[index]
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
    makeRestaurantSummaryText(optionsDetails, index);
};

// As t (spinTime) increases, the cubic term (tc) gets larger, resulting in a larger return value
function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}
