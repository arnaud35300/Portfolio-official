var handleInputBlurEvent = function (e) {
    var field = e.currentTarget;
    var error = document.getElementById("error-" + field.id);
    error.innerHTML = "";
    field.classList.remove('input-error');
    if (field.value.trim() <= 0) {
        error.innerHTML = ' | This field cannot be blank';
        field.classList.add('input-error');
    }
};
var displayMsg = function () {
    var btn = document.querySelector('.submit');
    var p = document.createElement('p');
    p.innerHTML = "Your message has been send !";
    p.classList.add("message-send");
    document.querySelector('.btn-container').removeChild(btn);
    document.querySelector('form').appendChild(p);
};
var sendData = function (url, data) {
    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(function (response) {
        displayMsg();
        return response.json();
    })["catch"](function (err) {
        return err;
    });
};
var handleSubmitEvent = function (e) {
    e.preventDefault();
    var url = '/mail';
    var firstname = document.querySelector('#firstname').value.trim();
    var lastname = document.querySelector('#lastname').value.trim();
    var email = document.querySelector('#email').value.trim();
    var subject = document.querySelector('#subject').value.trim();
    var content = document.querySelector('#body-message').value.trim();
    var data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        subject: subject,
        content: content
    };
    console.log('submit');
    sendData(url, data);
};
document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkMzUzMDAiLCJhIjoiY2thOGNoYW93MGJ0eDJzcDRxYjJmOXhwdSJ9.CyNItPb69VtTq6qp-n718g';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-4.378820, 48.360200],
        zoom: 4
    });
    map.addControl(new mapboxgl.NavigationControl());
    // https://www.gps-coordinates.net/
    var marker = new mapboxgl.Marker()
        .setLngLat([-1.378820, 48.360200])
        .addTo(map);
    //! contact form
    var form = document.querySelector('.contact-form');
    var inputs = document.querySelectorAll('input, textarea');
    for (var i = 0; i < inputs.length; i++)
        inputs[i].addEventListener('input', handleInputBlurEvent);
    form.addEventListener('submit', handleSubmitEvent);
});
