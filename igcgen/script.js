var brecord = [];

var mouseCoords = [];

var lastX = -1;
var lastY = -1;

var minLatIn, maxLatIn, minLonIn, maxLonIn;
var minLat = 2940.0;
var minLon = 600.0;
var maxLat = 3018.0;
var maxLon = 840.0;

var startAltIn, endAltIn;

var startAlt = 100;
var endAlt = 200;
var alt = -1;
function randAlt() {
	if (alt > endAlt) {
		alt += random(-3, 1);
	} else if (alt == endAlt) {
		alt += random(-3, 3);
	} else {
		alt += random(-1, 3);
	}
}

var button;
var inp;

var arec, date, pilot, cm2, gltype, glid, gpsdat, frmver, hrdver, lgtype, gpsrec, prsaltsens, compcl, compid;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function exportFile() {
	var name = millis() + ".igc";
	brecord[brecord.length - 1] = generateBRecordLast();
	var head = "A" + arec.value();
	head += "\nHFDTEDATE:" + date.value().replaceAll("/", "") + "\nHFDTE" + date.value().replaceAll("/", "");
	head += "\nHFPLTPILOTINCHARGE:" + pilot.value();
	head += "\nHFCM2CREW2:" + cm2.value();
	head += "\nHFGTYGLIDERTYPE:" + gltype.value();
	head += "\nHFGIDGLIDERID:" + glid.value();
	head += "\nHFDTMGPSDATUM:" + gpsdat.value();
	head += "\nHFRFWFIRMWAREVERSION:" + frmver.value();
	head += "\nHFRHWHARDWAREVERSION:" + hrdver.value();
	head += "\nHFFTYFRTYPE:" + lgtype.value();
	head += "\nHFGPSRECEIVER:" + gpsrec.value();
	head += "\nHFPRSPRESSALTSENSOR:" + prsaltsens.value();
	head += "\nHFCCLCOMPETITIONCLASS:" + compcl.value();
	head += "\nHFCIDCOMPETITIONID:" + compid.value();
	head += "\n" + inp.value();
  head += "\nI033638FXA3940SIU4143ENL";
	save(concat(head.split("\n"), brecord), name);
	// createElement('h2', "File name: " + name);
}
function setup() {
	createCanvas(600, 400);
	background(240);
	createElement("span", "A Record: ");
	arec = createInput("FLA1XA");
	createElement('br', "");
	createElement("span", "Date: ");
	date = createInput("18/07/19");
	createElement('br', "");
	createElement("span", "Pilot: ");
	pilot = createInput("Unknown");
	createElement('br', "");
	createElement("span", "Crew Member 2: ");
	cm2 = createInput("...");
	createElement('br', "");
	createElement("span", "Glider Type: ");
	gltype = createInput("LS 6/18m");
	createElement('br', "");
	createElement("span", "Glider ID: ");
	glid = createInput(".....");
	createElement('br', "");
	createElement("span", "GPS Datum: ");
	gpsdat = createInput("WGS84");
	createElement('br', "");
	createElement("span", "Firmware Version: ");
	frmver = createInput("Flarm-IGC06.63");
	createElement('br', "");
	createElement("span", "Hardware Version: ");
	hrdver = createInput("Flarm-IGC06");
	createElement('br', "");
	createElement("span", "Logger Type: ");
	lgtype = createInput("Flarm-IGC");
	createElement('br', "");
	createElement("span", "GPD Receiver: ");
	gpsrec = createInput("u-blox,TIM-LP,16,8191");
	createElement('br', "");
	createElement("span", "Pressure/Altitude Sensor: ");
	prsaltsens = createInput("Intersema MS5534B,8191");
	createElement('br', "");
	createElement("span", "Competition Class: ");
	compcl = createInput("18-Meter");
	createElement('br', "");
	createElement("span", "Competition ID: ");
	compid = createInput("....");
	createElement('br', "");
	inp = createElement('textarea', "");
	inp.size(300, 100);
	createElement('br', "");
	createElement("span", "Start Altitude (m): ");
	startAltIn = createInput('100');
	createElement('br', "");
	createElement("span", "End Altitude (m): ");
	endAltIn = createInput('200');
	createElement('br', "");
	createElement("span", "Minumum Latitude (min): ");
	minLatIn = createInput('' + minLat);
	createElement('br', "");
	createElement("span", "Maximum Latitude (min): ");
	maxLatIn = createInput('' + maxLat);
	createElement('br', "");
	createElement("span", "Minimum Longitude (min): ");
	minLonIn = createInput('' + minLon);
	createElement('br', "");
	createElement("span", "Maximum Longitude (min): ");
	maxLonIn = createInput('' + maxLon);
	createElement('br', "");
	var button2 = createButton("Update values");
	button2.mousePressed(updateVals);
	button = createButton("Generate File");
	button.mousePressed(exportFile);
	var button3 = createButton("Reset");
	button3.mousePressed(reset)
}

function reset() {
	background(240);
	brecord = [];
  lastX = -1;
  lastY = -1;
}

function updateVals() {
	minLat = parseFloat(minLatIn.value());
	maxLat = parseFloat(maxLatIn.value());
	minLon = parseFloat(minLonIn.value());
	maxLon = parseFloat(maxLonIn.value());
	startAlt = parseInt(startAltIn.value());
	endAlt = parseInt(endAltIn.value());
  alt = startAlt;
}

var hr = 8;
var mn = 40;
var sec = 10;

function yToLat(y) {
	return (y / height) * (maxLat - minLat) + minLat;
}
function xToLon(x) {
	return (x / width) * (maxLon - minLon) + minLon;
}

function zeroPad(count, str) {
	var temp = "" + str;
	return temp.padStart(count, '0');
}
function generateBRecord() {
	var record = "B";
	record += zeroPad(2, hr);
	record += zeroPad(2, mn);
	record += zeroPad(2, floor(sec));
	var lat = yToLat(height - mouseY);
	record += zeroPad(2, floor(lat / 60));
	record += zeroPad(5, floor((lat % 60) * 1000));
	record += "N";
	var lon = xToLon(mouseX);
	record += zeroPad(3, floor(lon / 60));
	record += zeroPad(5, floor((lon % 60) * 1000));
	record += "E";
	record += "A";
	record += zeroPad(5, floor(alt));
	record += zeroPad(5, floor(alt));
	record += "00209";
	record += "001";
	return record;
}
function generateBRecordLast() {
	var record = "B";
	record += zeroPad(2, hr);
	record += zeroPad(2, mn);
	record += zeroPad(2, floor(sec));
	var lat = yToLat(height - mouseY);
	record += zeroPad(2, floor(lat / 60));
	record += zeroPad(5, floor((lat % 60) * 1000));
	record += "N";
	var lon = xToLon(mouseX);
	record += zeroPad(3, floor(lon / 60));
	record += zeroPad(5, floor((lon % 60) * 1000));
	record += "E";
	record += "A";
	record += zeroPad(5, floor(endAlt));
	record += zeroPad(5, floor(endAlt));
	record += "00209";
	record += "001";
	return record;
}
function touchMoved() {
	if (pmouseX == mouseX && pmouseY == mouseY) {
		return;
	}
	if (lastX != -1 && lastY != -1) {
		sec += 2 * sqrt((mouseX - lastX)*(mouseX - lastX) + (mouseY - lastY)*(mouseY - lastY));
	}
	while (sec >= 60) {
		mn ++;
		sec -= 60;
	}
	while (mn >= 60) {
		hr ++;
		mn -= 60;
	}
	if (lastX != -1 && lastY != -1) {
		line(lastX, lastY, mouseX, mouseY);
	}
	lastX = mouseX;
	lastY = mouseY;
	append(brecord, generateBRecord());
	randAlt();
	ellipse(mouseX, mouseY, 2, 2);
}

class BRecord {
  constructor(hr, mn, sec, lat, lon) {
    this.hr = hr;
	this.mn = mn;
	this.sec = sec;
	this.lat = lat;
	this.lon = lon;
  }
  
  function toString() {
	var record = "B";
	record += zeroPad(2, hr);
	record += zeroPad(2, mn);
	record += zeroPad(2, floor(sec));
	var lat = yToLat(height - mouseY);
	record += zeroPad(2, floor(lat / 60));
	record += zeroPad(5, floor((lat % 60) * 1000));
	record += "N";
	var lon = xToLon(mouseX);
	record += zeroPad(3, floor(lon / 60));
	record += zeroPad(5, floor((lon % 60) * 1000));
	record += "E";
	record += "A";
	record += zeroPad(5, floor(endAlt));
	record += zeroPad(5, floor(endAlt));
	record += "00209";
	record += "001";
	return record;
  }
}