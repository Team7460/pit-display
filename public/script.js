let matches = [];

function getDates(value) {
  return value.predicted_time * 1000
}

function getNums(value) {
  return value.match_number
}

function sortNumber(a, b) {
  return a - b;
}

function loadJSON(callback) {

  const xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'tbaData.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

let tbaData;
loadJSON(function (response) {
      // Parse JSON string into object
      tbaData = JSON.parse(response);
  const matches = tbaData.map(getDates);
  const matchNos = tbaData.map(getNums);
  matches.sort(sortNumber);
      matchNos.sort(sortNumber);

  let leadingZero;
  let mLeadingZero;
  let hLeadingZero;

  let countDownDate = new Date('Dec 31, 2099 23:59:59').getTime();
  let nextMatch;

  const shiftLoop = setInterval(function () {
    const now = new Date().getTime();
    matches.sort(sortNumber);
    matchNos.sort(sortNumber)

    countDownDate = matches[0];
    nextMatch = matchNos[0];

    if (countDownDate < now) {
      matches.shift();
      matchNos.shift();
      countDownDate = matches[0];
      nextMatch = matches[0];
    } else {
      clearInterval(shiftLoop);
    }
  }, 100);

  // Update the count down every 1 second
  const x = setInterval(function () {
    matches.sort(sortNumber);
    matchNos.sort(sortNumber)

    countDownDate = matches[0];
    nextMatch = matchNos[0];

    // Get todays date and time
    const now = new Date().getTime();

    if (countDownDate < now) {
      matches.shift();
      matchNos.shift();
      countDownDate = matches[0];
      nextMatch = matches[0];
    }

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (seconds < 10) {
      leadingZero = '0'
    } else {
      leadingZero = '';
    }

    if (minutes < 10) {
      mLeadingZero = '0';
    } else {
      mLeadingZero = '';
    }

    if (hours < 10) {
      hLeadingZero = '0';
    } else {
      hLeadingZero = '';
    }

    if (seconds <= -1) {
      matches.shift();
      matchNos.shift();
    }

    if (minutes < 15 && hours == 0 && days == 0) {

      document.getElementById('clock').innerHTML = 'Queue';
    } else if (countDownDate == undefined) {
      document.getElementById('clock').innerHTML = `Fin`;

    } else {
      document.getElementById('clock').innerHTML = hLeadingZero + hours + ':' + mLeadingZero +
        minutes + ':' + leadingZero + seconds;

    }

  }, 1000);
});
