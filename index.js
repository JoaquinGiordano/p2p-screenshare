let peer = new Peer()
let actual_conn

let actual_call
let screenShareStream
let roomId

document.querySelector('#full_screen_button').style.display = 'none'

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML = `Tu ID: ${id}`
    roomId = id
})

peer.on('connection', (conn) => {
    actual_conn = conn
    console.log(actual_conn)
})

peer.on('call', (call) => {
    if (
        confirm(
            'Alguien esta intentando compartir su pantalla contigo, aceptas?'
        )
    ) {
        call.answer(null)
        call.on('stream', (stream) => {
            document.querySelector('#video_container').srcObject = stream
            document.querySelector('#full_screen_button').style.display =
                'block'
            document.querySelector('#start_button').style.display = 'none'
            document.querySelector('#dest_id').style.display = 'none'
            document.querySelector(
                '#id_container'
            ).innerHTML = `ID de la sala: ${call.peer}`
        })
    }
})

const createConnection = () => {
    actual_conn = peer.connect(document.querySelector('#dest_id').value)
}

const createCall = () => {
    navigator.mediaDevices
        .getDisplayMedia({ audio: false, video: true })
        .then((stream) => {
            screenShareStream = stream
            actual_call = peer.call(
                document.querySelector('#dest_id').value,
                stream
            )
            document.querySelector('#video_container').srcObject = stream
            document.querySelector('#full_screen_button').style.display =
                'block'
            document.querySelector('#start_button').innerHTML = 'Añadir persona'
            document.querySelector('#dest_id').value = ''
            document.querySelector(
                '#id_container'
            ).innerHTML = `ID de la sala: ${roomId}`
        })
}

const setFullScreen = () => {
    document.querySelector('#video_container').requestFullscreen()
}
