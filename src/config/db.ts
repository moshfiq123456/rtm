import mongoose from "mongoose"; 

import config from "./config"

const dbURL = config.db.url;

const dbConnect = () => {
	mongoose.connect(dbURL);

	mongoose.connection.on("connected", () => {
		console.log(`Connected to database sucessfully ${dbURL}`);
	});

	mongoose.connection.on("error", (err) => {
		console.log("Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Mongodb connection disconnected");
	});
};

export default dbConnect;