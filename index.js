let peer = new Peer()
let actual_conn

var actual_call
let screenShareStream
let roomId

document.querySelector('#full_screen_button').style.display = 'none'

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML = `Room ID: ${id}`
    roomId = id
})

peer.on('call', (call) => {
    if (!screenShareStream) {
        navigator.mediaDevices
            .getDisplayMedia({
                audio: {
                    echoCancellation: false,
                    googAutoGainControl: false,
                    autoGainControl: false,
                    noiseSuppresion: false,
                },
                video: {
                    width: 1920,
                    height: 1080,
                    frameRate: 60,
                },
            })
            .then((stream) => {
                call.answer(stream)
                screenShareStream = stream
                console.log(call)

                document.querySelector('#video_container').volume = 0
                document.querySelector('#video_container').srcObject = stream
                document.querySelector('#full_screen_button').style.display =
                    'block'

                document.querySelector('#dest_id').value = ''
                document.querySelector(
                    '#id_container'
                ).innerHTML = `Room ID: ${roomId}`
            })
    } else {
        call.answer(screenShareStream)
        document.querySelector('#dest_id').value = ''
    }
})

const createConnection = () => {
    actual_conn = peer.connect(document.querySelector('#dest_id').value)
}

const createCall = () => {
    //Creating Empty Stream

    const createEmptyVideoTrack = ({ width, height }) => {
        const canvas = Object.assign(document.createElement('canvas'), {
            width,
            height,
        })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        const stream = canvas.captureStream()
        const track = stream.getVideoTracks()[0]
        return Object.assign(track, { enabled: false })
    }

    const mediaStream = new MediaStream([
        createEmptyVideoTrack({ width: 0, height: 0 }),
    ])

    actual_call = peer.call(
        document.querySelector('#dest_id').value,
        mediaStream
    )

    actual_call.on('stream', (stream) => {
        document.querySelector('#video_container').srcObject = stream
        document.querySelector('#full_screen_button').style.display = 'block'

        document.querySelector('#dest_id').innerHTML = ''
        roomId = document.querySelector('#dest_id').value
        document.querySelector('#id_container').innerHTML = `Room ID: ${roomId}`
    })
}

const setFullScreen = () => {
    document.querySelector('#video_container').requestFullscreen()
}
