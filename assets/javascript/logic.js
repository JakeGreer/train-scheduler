$(document).ready(function() {

	setInterval(refresh, 1000 * 60);
	function refresh() {
		window.location.reload();
	}

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


		//grabs the values from the user input section and stores it in variables
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



			//format used for initial moment js input. (military time)
			formatTime = "HH mm";
			convertedTime = moment(snapshot.val().arrivalTime, formatTime);
			
			//converts the first train time subtracts a year so the time is relevant with the present time.
			var firstTimeConverted = moment(snapshot.val().arrivalTime, "HH:mm").subtract(1, "years");

			//grabs the current time
			var currentTime = moment();
			console.log("Current Time: " + moment(currentTime).format("HH:mm"));

			//finds the difference in time between the first train and the current time
			var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
			console.log("Difference in time: " + diffTime);

			//gets the remainder from the difference and the frequency
			var tRemainder = diffTime % snapshot.val().frequency;
			console.log("tRemainder: " + tRemainder);

			//final result of minutes until the train arrives
			var minTill = snapshot.val().frequency - tRemainder;
			console.log("Minutes till: " + minTill);

			//final result of the time the next train arrives
			var nextArrival = moment().add(minTill, "minutes");
			console.log("arrival time: " + moment(nextArrival).format("HH:mm"));


			var row = $("<tr>");		//creates a row that will store the table cells
			var butcell = $("<td>");	//cell that will store the remove button
			var nameCell = $("<td>");	//cell that will store the train name
			var destCell = $("<td>");	//cell that will store the train destination
			var freqCell = $("<td>");	//cell that will store the frequency
			var nextCell = $("<td>");	//cell that will store the time for the next arrival
			var minCell = $("<td>");	//cell that will store the minutes remaining

			var button = $("<button>"); //holds jquery button
			button.addClass("remove btn-defualt"); //adds the bootstrap classes for formatting
			button.attr("data-key", childKey); //assigns custom data-key attribute that stores the randomly generated key
			var span = $("<span>");		//span that will hold the bootstrap glyphicon
			span.addClass("glyphicon glyphicon-remove"); //adds glyphicon bootstrap classes
			button.append(span); //attaches the glyphicon to the button
			
			butcell.append(button); //attaches the button to the button cell
			nameCell.append(snapshot.val().name); //adds the name info to the name cell
			destCell.append(snapshot.val().destination); //adds the destination to the destination cell
			freqCell.append(snapshot.val().frequency); //adds the frequenct to the frequency cell
			nextCell.append(moment(nextArrival).format("hh:mm A")); //adds the time to the next arrival cell this time converting it to standard time with included suffix(AM/PM)
			minCell.append(minTill + " mins");//adds minutes remaining to the the minutes remaining cell

			$(row).append(butcell).append(nameCell).append(destCell).append(freqCell).append(nextCell).append(minCell);	//appends all the cells into the row query.
			$("#train-table").append(row); //appends the finalized row to the table on the DOM.


			//Function that controls the delete button
			$(".remove").on("click", function() {

				var data = this.getAttribute("data-key"); //stores the clicked buttons data-key into a variable called data

				console.log(data); //logs data
				var trainDataRef = database.ref("/train-data"); //stores our reference library into a variable
				trainDataRef.child(data).remove(); //goes into the reference library, finds the child that matches the data-key attribute and removes it from the database.
				window.location.reload(); //reloads the page upon removal to update the DOM.
			});



		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code); //Sends error message if firebase fails to be located.
		});
	}




	//calls the main program
	main();


});

