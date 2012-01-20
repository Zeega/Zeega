function encode_utf8( s )
{
  return unescape( encodeURIComponent( s ) );
}

function decode_utf8( s )
{
  return decodeURIComponent( escape( s ) );
}


var twoDigitString = function(num) {

	if (num < 10) {
		return "0" + num.toString();
	} else {
		return num.toString();
	}
};

var stringToJSDate = function(dateString) {
	// takes a string in the form "yyyy-mm-dd hh:mm:ss" and returns
	// a javascript date object
	if (dateString) {
		dateTime = dateString.split(' ');

		yearMonthDay = dateTime[0].split('-');
		year = yearMonthDay[0];
		month = yearMonthDay[1];
		day = yearMonthDay[2];

		hoursMinutesSeconds = dateTime[1].split(':');
		hours = hoursMinutesSeconds[0];
		minutes = hoursMinutesSeconds[1];
		seconds = hoursMinutesSeconds[2];
		milliseconds = 0;

		return new Date(year, month, day, hours, minutes, seconds, milliseconds);
	}
	return "";
};

var stringToMms = function(dateString) {
	// takes a string in the form "yyyy-mm-dd hh:mm:ss" and returns milliseconds
	// since jan 1 1970
	if (dateString) {

		return stringToJSDate(dateString).getTime();
	}
	return "";
};

var mmsToString = function(dateMms) {
	// takes milliseconds since jan 1 1970 and returns a string in the form
	// "yyyy-mm-dd hh:mm:ss".

	d = new Date(dateMms);
	year = d.getFullYear();
	month = twoDigitString(d.getMonth());
	date = twoDigitString(d.getDate());

	hours = twoDigitString(d.getHours());
	minutes = twoDigitString(d.getMinutes());
	seconds = twoDigitString(d.getSeconds());

	return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
};

var stringToFormatted = function(dateString) {
	// takes a string in the form "yyyy-mm-dd hh:mm:ss" and returns a string in
	// the form "Monday, December 19, 2011 at 7:00pm"

	if (!dateString) {
		return "";
	}
	date = stringToJSDate(dateString);

	switch (date.getDay()) {
	case 0:
		dayOfWeek = "Sunday";
		break;
	case 1:
		dayOfWeek = "Monday";
		break;
	case 2:
		dayOfWeek = "Tuesday";
		break;
	case 3:
		dayOfWeek = "Wednesday";
		break;
	case 4:
		dayOfWeek = "Thursday";
		break;
	case 5:
		dayOfWeek = "Friday";
		break;
	case 6:
		dayOfWeek = "Saturday";
		break;
	}

	switch (date.getMonth()) {
	case 0:
		month = "January";
		break;
	case 1:
		month = "February";
		break;
	case 2:
		month = "March";
		break;
	case 3:
		month = "April";
		break;
	case 4:
		month = "May";
		break;
	case 5:
		month = "June";
		break;
	case 6:
		month = "July";
		break;
	case 7:
		month = "August";
		break;
	case 8:
		month = "September";
		break;
	case 9:
		month = "October";
		break;
	case 10:
		month = "November";
		break;
	case 11:
		month = "December";
		break;
	}

	formattedString = dayOfWeek + ", " + month + " " + date.getDate() + ", " + date.getFullYear();
	rawh = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();

	if (rawh + m + s != 0) {
		if (rawh == 0) {
			h = 12;
			ap = "AM";
		} else if (rawh < 12) {
			h = rawh;
			ap = "AM";
		} else if (rawh == 12) {
			h = 12;
			ap = "PM";
		} else {
			h = rawh - 12;
			ap = "PM";
		}
		formattedString += " at " + h + ":" + m;
		if (s != 0) {
			formattedString += ":" + s;
		}
		formattedString += " " + ap;
	}

	return formattedString;

};