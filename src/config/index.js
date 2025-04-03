const { 
	INTERNAL_KEY, CLOUDY_KEY, CLOUDY_NAME, CLOUDY_SECRET, CLOUDY_ACCESS_KEY
} = require("../hidden.json");

const EMAIL_REGEX = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
const baseAPIurl = "https://api.sledgedrip.com";
// const baseAPIurl = "http://localhost:853"; // for test
const clouderUrl = "https://api.clouder.xnyder.com";

const random_numbers = (length) => {
	if (length === undefined || length === null || length === 0) {
		return 0;
	} else {
		let rand_number = "";
		for (let index = 0; index < length; index++) {
			rand_number += Math.floor(Math.random() * 10);
		}
		return rand_number;
	}
};

export const config = {
	key: "encrypted_key",
	EMAIL_REGEX,
	baseAPIurl,
	clouderUrl,
	cloudy_key: CLOUDY_KEY, 
	cloudy_name: CLOUDY_NAME, 
	cloudy_secret: CLOUDY_SECRET,
	cloudy_access_key: CLOUDY_ACCESS_KEY,
	uuid: random_numbers
};