function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date('2021-09-18T19:30:00');
initializeClock('clockdiv', deadline);

$('.scrollplz').click(function (event) {
  $('body, html').animate(
    {
      scrollTop: $('#after-hero').offset().top,
    },
    600
  );
});

$('.confirmarePrezenta').click(function (event) {
  event.preventDefault();
  const invitati = [];

  $('.formNume').each(function () {
    if ($(this).val().length !== 0) {
      // console.log($(this).val());
      invitati.push($(this).val().toString());
    }
  });
  console.log(invitati);
  // if (invitati.length === 0) {
  //   $('.alert-danger').show().delay(3500).fadeOut();
  //   return;
  // }
  const total = $('#formPersoane').val();
  console.log(total);
  const confirmare = $('input[name="exampleRadios"]:checked').val();
  console.log(confirmare);
  const payload = {
    attributes: {
      invitati: invitati.toString(),
      total: parseInt(total),
      confirmare: confirmare.toString(),
    },
    geometry: {
      x: 0,
      y: 0,
    },
  };

  const URL = `https://services6.arcgis.com/MLuUQwq7FiARivuF/arcgis/rest/services/invitati/FeatureServer/0/addFeatures?f=json&features=${JSON.stringify(
    payload
  )}`;

  fetch(URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then(function (res) {
      return res.json();
    })
    .then((json) => {
      const modalBody = $('.modal-body');
      if (confirmare === 'true') {
        $('.rsvp-container').css({ height: '350px' });
        const text =
          '<h4>Multumim ca ati ales sa fiti alaturi de noi!</h4><h4>Ne vedem pe 18 Septembrie 2021</h4>';
        $('.modal-body').html(text);
      } else {
        $('.rsvp-container').css({ height: '350px' });
        const text =
          '<h4>Multumim pentru raspuns!</h4><h4>Speram sa ne revedem cu alta ocazie!</h4>';
        $('.modal-body').html(text);
      }

      setTimeout(() => {
        $('#confirmationModal').modal('toggle');
        location.reload();
      }, 4000);
    })
    .catch(function (res) {
      console.log(res);
    });
});

$('.formNume').on('input', function () {
  let dInput = this.value;
  console.log(dInput);
  let isEmpty = true;
  if (
    $('.formNume').filter(function () {
      return $(this).val().trim();
    }).length > 0
  ) {
    isEmpty = false;
  }
  if (!isEmpty) {
    $('.alert-danger').hide();
    $('.confirmarePrezenta').show();
  } else {
    $('.alert-danger').show();
    $('.confirmarePrezenta').hide();
  }
});
