$(document).ready(function() {

	function main() {
		var config = {}; 		// Firebase Config
		var database; 			// var to hold firebase.database

		// Initialize Firebase
		var config = {
		  apiKey: "AIzaSyDmrgAIvj8RGlJbDf9j435rmX6bXczLp5c",
		  authDomain: "jg-firebase.firebaseapp.com",
		  databaseURL: "https://jg-firebase.firebaseio.com",
		  projectId: "jg-firebase",
		  storageBucket: "jg-firebase.appspot.com",
		  messagingSenderId: "583640635521"
		};
  		firebase.initializeApp(config);		
		database = firebase.database();		

		//adds train info to the DOM
		listTrains(database)					

		//click event to trigger addTrain function
		$("#add-train-btn").click(function() {
			event.preventDefault();
			addTrain(database);
			$("#train-name-input", "destination-input", "first-train-input", "frequency-input").val('');
		});
	}

	// add train function
	function addTrain(database) {

		var name;			// Train name
		var destination;	// Train destination
		var arrivalTime;	// inputted arrival time
		var frequency;		// How often train arrives
		var timeStamp;		// FB timestamp

		var formatTime;		// Format for moment.js
		var convertedTime;	// converted time
		var displayTime;	// converted time for displaying in DOM
		var timeLeft;		// time left until next train
		var nextStopTime;	// Display next stop time
		var nextStop;		// next stop time

		name = $("#train-name-input").val().trim();
		destination = $("#destination-input").val().trim();
		arrivalTime = $("#first-train-input").val().trim();
		frequency = $("#frequency-input").val().trim();
		formatTime = "HH mm";



		// Pushes new train info to the FB server
		database.ref("/train-data").push({
			name: name,
			destination: destination,
			frequency: frequency,
			arrivalTime: arrivalTime,
			
		})

		//console log inputs and converted times
		console.log("------------------------------")
		console.log("input captured: " + name);
		console.log("input captured: " + destination);
		console.log("input captured: " + frequency);
		console.log("input captured: " + arrivalTime);

	}

	//Lists trains in the DOM with info from the FB server
	function listTrains(database) {
		database.ref("/train-data").on("child_added", function(snapshot) {

			var formatTime;		// Format for moment.js
			var convertedTime;	// converted time
			var displayTime;	// converted time for displaying in DOM
			var timeLeft;		// time left until next train
			var nextStopTime;	// Display next stop time
			var nextStop;		// next stop time
			var childKey = snapshot.key;
			console.log(childKey);


			formatTime = "HH mm";
			convertedTime = moment(snapshot.val().arrivalTime, formatTime);
			

			var firstTimeConverted = moment(snapshot.val().arrivalTime, "HH:mm").subtract(1, "years");

			//------------------------------
			var currentTime = moment();
			console.log("Current Time: " + moment(currentTime).format("HH:mm"));

			//------------------------------
			var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
			console.log("Difference in time: " + diffTime);

			//------------------------------
			var tRemainder = diffTime % snapshot.val().frequency;
			console.log("tRemainder: " + tRemainder);

			//------------------------------
			var minTill = snapshot.val().frequency - tRemainder;
			console.log("Minutes till: " + minTill);

			//------------------------------
			var nextArrival = moment().add(minTill, "minutes");
			console.log("arrival time: " + moment(nextArrival).format("HH:mm"));
			
			var row = $("<tr>");
			var cell = $("<td>");
			var button = $("<button>");
			button.addClass("remove btn-defualt");
			button.attr("data-key", childKey);
			var span = $("<span>");
			span.addClass("glyphicon glyphicon-remove");
			$(button).append(span);
			$(cell).append(button);
			$(row).append(cell);


			var trainRow = "<td>"
				+ 
				snapshot.val().name + "</td><td>"			        //Train name snapshot from FB database
				+
				snapshot.val().destination + "</td><td>"	        //Train destination snapshot from FB database
				+
				snapshot.val().frequency + "</td><td>"		        //Train frequency snapshot from FB database
				+
				moment(nextArrival).format("hh:mm A") + "</td><td>"	//Train next arrival time snapshot from FB database
				+
				minTill + " mins" + "</td>";			        //Train time till next arrival snapshot from FB database
			
			$(row).append(trainRow);	
			$("#train-table").append(row);

			$(".remove").on("click", function() {

				var data = this.getAttribute("data-key");

				console.log(data);
				var trainDataRef = database.ref("/train-data");
				trainDataRef.child(data).remove();
				window.location.reload();
			})


		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	}




	//calls the main program
	main();
	

});

