const handleInputBlurEvent = (e: any): void => {
    const field = e.currentTarget
    const error: HTMLElement = document.getElementById(`error-${field.id}`)

    error.innerHTML = ""
    field.classList.remove('input-error')

    if (field.value.trim() <= 0) {
        error.innerHTML = ' | This field cannot be blank'
        field.classList.add('input-error')
    }
}

const displayMsg = function () {
    let btn: HTMLElement = document.querySelector('.submit')
    let p: HTMLElement = document.createElement('p')

    p.innerHTML = "Your message has been send !"
    p.classList.add("message-send")

    document.querySelector('.btn-container').removeChild(btn)
    document.querySelector('form').appendChild(p)
}

const sendData = function (url, data) {

    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            displayMsg()
            return response.json()
        })
        .catch((err) => {
            return err
        })
}

const handleSubmitEvent = function (e: any): any {
    e.preventDefault()

    const url: string = '/mail'
    const firstname = (<HTMLInputElement>document.querySelector('#firstname')).value.trim()
    const lastname = (<HTMLInputElement>document.querySelector('#lastname')).value.trim()
    const email = (<HTMLInputElement>document.querySelector('#email')).value.trim()
    const subject = (<HTMLInputElement>document.querySelector('#subject')).value.trim()
    const content = (<HTMLTextAreaElement>document.querySelector('#body-message')).value.trim()

    let data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        subject: subject,
        content: content
    }
    sendData(url, data)
}

document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJuYXVkMzUzMDAiLCJhIjoiY2thOGNoYW93MGJ0eDJzcDRxYjJmOXhwdSJ9.CyNItPb69VtTq6qp-n718g'
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-4.378820, 48.360200],
        zoom: 4
    })

    map.addControl(new mapboxgl.NavigationControl())

    // https://www.gps-coordinates.net/
    var marker = new mapboxgl.Marker()
        .setLngLat([-1.378820, 48.360200])
        .addTo(map)

    //! contact form
    const form: HTMLElement = document.querySelector('.contact-form')
    const inputs: NodeListOf<HTMLElement> = document.querySelectorAll('input, textarea')

    for (let i = 0; i < inputs.length; i++)
        inputs[i].addEventListener('input', handleInputBlurEvent)

    form.addEventListener('submit', handleSubmitEvent)
})