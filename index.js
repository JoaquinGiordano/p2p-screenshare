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

peer.on('call', (call) => {
    call.answer(null)
    call.on('stream', (stream) => {
        document.querySelector('#video_container').srcObject = stream
        document.querySelector('#full_screen_button').style.display = 'block'
        document.querySelector('#start_button').style.display = 'none'
        document.querySelector('#dest_id').style.display = 'none'
        document.querySelector(
            '#id_container'
        ).innerHTML = `ID de la sala: ${call.peer}`
    })
})

const createConnection = () => {
    actual_conn = peer.connect(document.querySelector('#dest_id').value)
}

const createCall = () => {
    if (!screenShareStream) {
        navigator.mediaDevices
            .getDisplayMedia({
                audio: {
                    echoCancellation: false,
                    googAutoGainControl: false,
                    autoGainControl: false,
                    noiseSuppresion: false,
                },
                video: { height: 1080, width: 1920, frameRate: 60 },
            })
            .then((stream) => {
                screenShareStream = stream
                actual_call = peer.call(
                    document.querySelector('#dest_id').value,
                    stream
                )
                document.querySelector('#video_container').volume = 0
                document.querySelector('#video_container').srcObject = stream
                document.querySelector('#full_screen_button').style.display =
                    'block'

                document.querySelector('#dest_id').value = ''
                document.querySelector(
                    '#id_container'
                ).innerHTML = `ID de la sala: ${roomId}`
            })
    } else {
        actual_call = peer.call(
            document.querySelector('#dest_id').value,
            screenShareStream
        )
        document.querySelector('#video_container').srcObject = screenShareStream
        document.querySelector('#full_screen_button').style.display = 'block'
        document.querySelector('#dest_id').value = ''
        document.querySelector(
            '#id_container'
        ).innerHTML = `ID de la sala: ${roomId}`
    }
}

const setFullScreen = () => {
    document.querySelector('#video_container').requestFullscreen()
}
