import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { getCurrentTime, getCurrentDate } from "./DataHandling.js";
import React, { useState } from "react";


//This enables applying for gigs ad other test features
const testMode = false

// FOR FUNCTIONS THAT START WITH TEMP:
// Only used in database testing, no not make any actual app logic rely on them
// All temp functions will get changed or deleted frequently

//Example on how to get data from the database
async function tempGetGig() {
	//Sets a reference to which document you want, format (db, foldername, filename)
	//Folder and file names can be read from variables
	const docRef = doc(db, "gigs", "gig_1");

	//Gets a copy of the file specified in the reference
	const docData = await getDoc(docRef);

	//Returns the data contained in the document. The .data() function is necessary
	return docData.data();
}

//Export the temp functions here
export { tempGetGig };

//This stores the current user so that other functions can use it
var currentUser = "";
var currentUserId = "";
//This stores all users so user switching remembers which order it should do it
var allUsers = [];
//Gets all users as an array and returns it. Very much work in progress
async function getUser() {
	var users = [];
	const usersSnapshot = await getDocs(collection(db, "users"));
	usersSnapshot.forEach((doc) => {
		const data = doc.data();
		data.id = doc.id
		users.push(data);
	});
	currentUser = users[0];
	if (allUsers.length === 0) {
		allUsers = users;
	}
	console.log(`Current user: ${currentUser.name}`);
	return users;
}

//Switches the current user by shfting the next user in the allUsers array to position[0] and makes it the new current user
async function switchUser() {
	const u = allUsers.shift();
	allUsers.push(u);
	currentUser = allUsers[0];
	getActiveGigs();
	console.log(`Current user: ${currentUser.name}`);
}

//Edits the required data in correct format for activegigslist screen
function formatActiveGigsData(gigsData, id, gigId) {
	const ITEM = {
		id: id,
		gigId: gigId,
		startLocation: `${gigsData.startLocation}`,
		endLocation: `${gigsData.endLocation}`,
		title: `${gigsData.startLocation} - ${gigsData.endLocation}`,
		leaveTime: `${gigsData.startTime}`,
		arrivalTime: `${gigsData.endTime}`,
		vehicle: gigsData.vehicle,
		startAddress: gigsData.startAddress,
		arrivalAddress: gigsData.endAddress,
		estimatedTime: "Not implemented",
		addInfo: "DOnt have these yet either lol",
		reward: gigsData.reward,
		client: gigsData.client,
		startCoord: gigsData.startCoord,
		endCoord: gigsData.endCoord,
		startLat: gigsData.startLat,
		startLon: gigsData.startLon,
		endLat: gigsData.endLat,
		endLon: gigsData.endLon,
	};
	return ITEM;
}

function formatAvailableGigsData(aGigsData, id, gigId) {
	const ITEM = {
		id: id,
		gigId: gigId,
		startLocation: `${aGigsData.startLocation}`,
		endLocation: `${aGigsData.endLocation}`,
		startCoord: aGigsData.startCoord,
		endCoord: aGigsData.endCoord,
		reward: aGigsData.reward,
		startTime: aGigsData.startTime,
		endTime: aGigsData.endTime,
		client: aGigsData.client,
		startLat: aGigsData.startLat,
		startLon: aGigsData.startLon,
		endLat: aGigsData.endLat,
		endLon: aGigsData.endLon,
		route: `${aGigsData.startLocation} - ${aGigsData.endLocation}`,
	};
	return ITEM;
}

//This stores current users active gigs, so that asctivegigslist does not need to load the data on layout
var activeGigsData = [];
//Gets an array of user_1 active gigs. When user switching is completed, will change it to get active gigs of current user
async function getActiveGigs() {
	//Gets data for a gig specified by the gig id in users active gigs array and pushes it to activegigs
	var id = 0;
	const activeGigs = [];

	//Gets a gig, formats it with another function, increments the id and pushes the result to activegigs array
	async function getGig(value) {
		const gigSnapshot = await getDoc(doc(db, "gigs", value));
		const formattedGigs = formatActiveGigsData(gigSnapshot.data(), id, gigSnapshot.id);
		activeGigs.push(formattedGigs);
		id += 1;
	}

	//Gets users active gigs array
	const activeGigsPerUser = currentUser.gigsActive;

	//Checks if users active gigs array is not empty, if it's not then runs the getGig function for all of them
	if (activeGigsPerUser.length === 0) {
		var arr = [];
		activeGigsData = arr;
		return "No active gigs";
	} else {
		await activeGigsPerUser.forEach(getGig);
		activeGigsData = activeGigs;
		return activeGigs;
	}
}

//A function to get gigs from the DB that are NOT completed
//@Ira
var availableGigsData = [];

async function getOngoingGigs() {
	//Return gigs in an arraylist
	const gigArray = [];

	const q = query(collection(db, "gigs"), where("user", "==", "")); //Filters gigs that are already done
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		const id = gigArray.length;
		const formattedGig = formatAvailableGigsData(doc.data(), id, doc.id);
		gigArray.push(formattedGig); //Append gigs to gigArray-list
		availableGigsData = gigArray;
	});
}

//This functon gets the client names associated with a gig in the gigstart or gigapply screens
async function getClientName(gigType, id) {
	//Gig type should be either available or active, depending on which screen it is called from
	let clientId = "";

	//Checks if to get the client from active or available gigs and returns the correct clients name
	if (gigType === "available") {
		clientId = availableGigsData[id].client;
		const clientSnap = await getDoc(doc(db, "clients", clientId));
		return clientSnap.data().name;
	} else if (gigType === "active") {
		clientId = activeGigsData[id].client;
		const clientSnap = await getDoc(doc(db, "clients", clientId));
		return clientSnap.data().name;
	} else {
		console.log("Incorrect gig type");
	}
}

let activeGig = ''
function setActiveGig(gig){
	activeGig = gig;
}


async function applyForGig(gigId, arrayPos){
	if (testMode === true){
		const gigRef = doc(db, "gigs", gigId)
		updateDoc(gigRef, {user: currentUser.id})
		const gig = await getDoc(gigRef)
		const userRef = doc(db, "users", currentUser.id)
		updateDoc(userRef, {
			gigsActive: arrayUnion(gigId)
		})
		availableGigsData.splice(arrayPos, 1)
		console.log(gig.data())
		const id = activeGigsData.lenght - 1
		const formattedGig = formatActiveGigsData(gig.data(), id, gig.id)
		activeGigsData.push(formattedGig)
		console.log(formattedGig)
	} else {
		console.log('Test mode is disabled, no changes to DB made')
	}
}

//Export non-temp functions and data here
export {
	getClientName,
	getOngoingGigs,
	getUser,
	getActiveGigs,
	activeGigsData,
	currentUser,
	switchUser,
	availableGigsData,
	setActiveGig,
	activeGig,
	applyForGig,
};
