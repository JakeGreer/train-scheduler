var train = "";
var destination = "";
var firstTrain = "";
var frequency = "";
var nextTrain = "";

var config = {
apiKey: "AIzaSyDmrgAIvj8RGlJbDf9j435rmX6bXczLp5c",
authDomain: "jg-firebase.firebaseapp.com",
databaseURL: "https://jg-firebase.firebaseio.com",
projectId: "jg-firebase",
storageBucket: "jg-firebase.appspot.com",
messagingSenderId: "583640635521"
};

firebase.initializeApp(config);

$("#add-train-btn").on("click", function() {
	event.preventDefault();

	train  = $("#train-name-input").val();
	destination = $("#destination-input").val();
	firstTrain = $("#first-train-input").val();
	frequency = $("#frequency-input").val();

	console.log(train);
	console.log(destination);
	console.log(firstTrain);
	console.log(frequency);

	// Assumptions
	var tFrequency = $("#frequency-input").val();;

	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
	console.log(firstTrainConverted);

	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	// Difference between the times
	var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % tFrequency;
	console.log(tRemainder);

	// Minute Until Train
	var tMinutesTillTrain = tFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);


	// Next Train
	nextTrain = moment().add(tMinutesTillTrain, "minutes");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



	firebase.database().ref().push({
		train: train,
		destination: destination,
		firstTrain: firstTrain,
		frequency: frequency,
		nextTrain: moment(nextTrain).format("hh:mm A"),
		tMinutesTillTrain: tMinutesTillTrain,
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	})


});

   firebase.database().ref().on("child_added", function(snapshot) {

		$("#trainAdd").append("<tr><td>" + snapshot.val().train + "</td>" + "<td>" + snapshot.val().destination + "</td>"+ "<td>" + snapshot.val().frequency + "</td>" + "<td>" + snapshot.val().nextTrain + "</td><td>" + snapshot.val().tMinutesTillTrain + "</td><td></td></tr>");

})









