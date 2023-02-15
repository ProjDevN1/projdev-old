import * as React from "react";
import { StyleSheet } from "react-native";

{
	/*
In this file you can create multiple css styles to be used troughout the app
as with other things, we use export here to be able to import the STYLES object in other files
Basically all styling should be done trough this file to keep the main app cole as clean as possible
*/
}

{
	/*Under here is the STYLES object, every style should be contained in it*/
}
{
	/*
The example style should remain to give people an idea of how it works
In the exaple, you can put css styling, the syntax is a bit different, for correct usage check react native docs
To use the styles, give the object in the app code the style attribute with STYLES.x where x is the spesific style in this file you want
*/
}

//Global variables
const colorBase = "#E9E9E9";
const colorAlt = "#CCD2D6";
const colorAccent = "#389ADE";
const colorDark = "#1F5673";
const colorDarker = "#000000";
const colorError = "red";

const font = "Raleway";
const fsXL = 36;
const fsL = 24;
const fsM = 16;
const fsSm = 12;
const fsXs = 8;
const borderRadius = 8;

//example stylesheet - don't touch
export const STYLES = StyleSheet.create({
	div: {
		borderWidth: 5,
		borderColor: "black",
	},

	example: {
		//backgroundColor: "white",
	},
});

export const LAYOUT = StyleSheet.create({});

export const LOGIN = StyleSheet.create({
	contentWrapper: {
		backgroundColor: colorAccent,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontFamily: font,
		fontSize: fsXL,
		color: colorBase,
		marginBottom: 24,
	},

	container: {
		backgroundColor: colorBase,
		borderRadius: borderRadius,
		padding: 16,
		width: 200,
	},

	label: {
		fontFamily: font,
		fontSize: fsM,
		marginTop: 16,
	},

	input: {
		fontSize: fsSm,
		backgroundColor: colorAlt,
		borderRadius: borderRadius,
		padding: 8,
		marginTop: 6,
		marginBottom: 8,
		borderWidth: 2,
		borderColor: colorAccent,
		color: colorDarker,
	},

	button: {
		backgroundColor: colorAlt,
		alignSelf: "flex-start",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: borderRadius,
		borderColor: colorAccent,
		borderWidth: 2,
		color: colorDark,
	},

	buttonTxt: {
		fontSize: fsSm,
	},

	errrorMsg: {
		color: colorError,
		fontSize: fsXs,
		marginBottom: 8,
		fontStyle: "italic",
	},

	forgotPasswordTxt: {
		color: colorDarker,
		fontStyle: "italic",
		fontWeight: 100,
		fontSize: fsXs,
		textDecorationLine: "underline",
		marginVertical: 12,
	},
});
