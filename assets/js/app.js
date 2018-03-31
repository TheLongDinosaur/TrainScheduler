
// sets global variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// sets jQuery global variables
var elTrain = $("#train-name");
var elTrainDestination = $("#train-destination");

// form validation for Time using jQuery Mask plugin
var elTrainTime = $("#train-time").mask("00:00");
var elTimeFreq = $("#time-freq").mask("00");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDzcgwSEGpzHTGZOqUKNf7tvsiJySONye8",
    authDomain: "traintimes-6cb95.firebaseapp.com",
    databaseURL: "https://traintimes-6cb95.firebaseio.com",
    projectId: "traintimes-6cb95",
    storageBucket: "",
    messagingSenderId: "541429698299"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'*
var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    // creates local variables to store data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

    // calculates the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes*
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // gets the remainder of time by using 'moderator' with the frequency & time difference, store in var*
    trainRemainder = trainDiff % frequency;

    // subtracts the remainder from the frequency, store in var*
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format*
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // appends to our table of trains, inside tbody, with a new row of the train data*
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button*
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

    // STARTED BONUS TO REMOVE ITEMS ** not finished ** *
    $("#table-data").on("click", "tr span", function() {
        console.log(this);
        var trainRef = database.ref("/trains/");
        console.log(trainRef);
    });
});

// function to call the button event, and store the values in the input form*
var storeInputs = function(event) {
    // prevents from from resetting
    event.preventDefault();

    // gets & stores input values*
    trainName = elTrain.val().trim();
    trainDestination = elTrainDestination.val().trim();
    trainTime = moment(elTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = elTimeFreq.val().trim();

    // adds to firebase database*
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    // lets user know their input was successfully recorded
    alert("Train and schedule added successfully!");

    // clears the form after submission
    elTrain.val("");
    elTrainDestination.val("");
    elTrainTime.val("");
    elTimeFreq.val("");
};

// stores information entered by user when submit button is clicked
$("#btn-add").on("click", function(event) {
    // if user attempts to submit an empty form, the browser will alert them to enter the information
    if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
        alert("You haven't entered any information!");
    } else {   
        storeInputs(event);
    }
});

// stores information entered by user when enter key is pressed
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // if user attempts to submit an empty form, the browser will alert them to enter the information
        if (elTrain.val().length === 0 || elTrainDestination.val().length === 0 || elTrainTime.val().length === 0 || elTimeFreq === 0) {
            alert("You haven't entered any information!");
        } else {
            storeInputs(event);
        }
    }
});
