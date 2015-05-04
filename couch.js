var record = {};

function setup() {
  // set a clock to update the Timestamp field every second:
  setInterval(clock, 1000);

  // set event listeners for the buttons.
  // First get the whole button div:
  var buttonDiv = document.getElementById('buttonDiv');
  // then get all the buttons in a list:
  var buttons = buttonDiv.getElementsByTagName('*');
  // the iterate over the list and add event listeners:
  for (var b=0; b < buttons.length ; b++) {
    buttons[b].addEventListener('click', contactServer, false);
  };
  var newID = document.getElementsByName('newID');
  newID[0].addEventListener('click', function(){document.getElementById('_id').value = generateUuid()}, false);
  var plot = document.getElementsByName('plot');
  plot[0].addEventListener('click', function(){plotFootprint()}, false);    
};

// this function updates the date/time field  once a second:
function clock() {
  var dateField = document.getElementById('date');
  dateField.value = new Date();
}

function generateUuid() {
  var _id = 100000 * Math.random();
  _id = "temporary-"+ Math.floor(_id);
  return _id;
}

// this function contacts the server:
function contactServer() {
  // get the method from the button clicked:
  var method = event.target.innerHTML;

  // get the record _id from the _id field:
  var id = document.getElementById('_id').value;

  if (id) record._id = id;

  // set up the basic HTTP parameters:
  var params = {
    url: 'http://104.236.9.143:5984/pp_contacts/',
    type: method,
    success: callback,
    contentType: 'application/json',
    dataType: 'json',
  }
  // convert the data to a string for sending:
  data = JSON.stringify(record);

  // GET wants /document/recordID and no request body:
  if (method === 'GET') {
    params.url += record._id;
  }

  // POST wants /document/ and a request body with record ID and record Rev:
  if (method === 'POST') {
    params.data = data;
  }

  // PUT wants /document/recordID and a request body with just the data
  // (ID optional in the body):
  if (method === 'PUT') {
    params.url += record._id;
    record.activityBy = document.getElementById('activityBy').value;
    record.eventDate = document.getElementById('eventDate').value;
    data = JSON.stringify(record);
    params.data = data;
    // clear the fields
    document.getElementById('activityBy').value ="";
    document.getElementById('eventDate').value ="";
    document.getElementById('_rev').value ="";
  }

  // DELETE wants /document/recordID?recordRev and no request body:
  if (method === 'DELETE') {
    params.url += record._id;
    params.url += "?rev=" + record._rev;
    document.getElementById('activityBy').value ="";
    document.getElementById('eventDate').value ="";
    document.getElementById('_rev').value ="";
    document.getElementById('footprint').value ="";
  }

  // make the HTTP call:
  $.ajax(params);
  console.dir(data);
}

// this function gets the request response:
function callback(data) {
  // save the response as the local record:
  record = data;
  if (record._id){
    document.getElementById('activityBy').value = record.activityBy;
    document.getElementById('eventDate').value = record.eventDate;
    document.getElementById('_rev').value = record._rev;
    document.getElementById('footprint').value = JSON.stringify(record.footprint);
  }
  console.dir(record);
}

function plotFootprint() {
  var geojsonFeature = JSON.stringify(record.footprint);
  geojsonFeature = geojsonFeature.slice(1,geojsonFeature.length - 1);
  L.geoJson(geojsonFeature).addTo(map);
}
