let peer = new Peer()
let actual_conn

var actual_call
let screenShareStream
let roomId

const pageParamsStr = window.location.search
const parsedParams = new URLSearchParams(pageParamsStr)

document.querySelector('#full_screen_button').style.display = 'none'

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML = `Room ID: ${id}`
    roomId = id

    if (parsedParams.get('roomid')) {
        loadJoinRequest(parsedParams.get('roomid'))
    } else {
        loadScreen()
    }
})

const loadJoinRequest = (id) => {
    document.querySelector(
        '#screen_container'
    ).innerHTML = `<div id="join_request_container"><h2>¿Deseas entrar a esta sala?</h2><div><button onclick="acceptCall('${id}')" class="join_request_button accept">Aceptar</button><button onclick="denyCall()" class="join_request_button deny">Cancelar</button></div></div>`
}

const loadScreen = () => {
    document.querySelector(
        '#screen_container'
    ).innerHTML = `<video id="video_container" autoplay="true" />`
}

const acceptCall = (id) => {
    console.log(id)
    createCall(id)
}

const denyCall = () => {
    loadScreen()
}

const copyURL = () => {
    if (parsedParams.get('roomid')) {
        document.querySelector(
            '#copy_input'
        ).value = `https://joaquingiordano.github.io/p2p-screenshare?roomid=${parsedParams.get(
            'roomid'
        )}`
    } else {
        document.querySelector(
            '#copy_input'
        ).value = `https://joaquingiordano.github.io/p2p-screenshare?roomid=${roomId}`
    }

    document.querySelector('#copy_input').select()
    document.execCommand('copy')
}

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

const createCall = (id) => {
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

    if (id) {
        loadScreen()
        actual_call = peer.call(id, mediaStream)
        roomId = id
    } else {
        actual_call = peer.call(
            document.querySelector('#dest_id').value,
            mediaStream
        )
        roomId = document.querySelector('#dest_id').value
    }

    actual_call.on('stream', (stream) => {
        document.querySelector('#video_container').srcObject = stream
        document.querySelector('#full_screen_button').style.display = 'block'

        document.querySelector('#dest_id').innerHTML = ''

        document.querySelector('#id_container').innerHTML = `Room ID: ${roomId}`
    })
}

const setFullScreen = () => {
    document.querySelector('#video_container').requestFullscreen()
}
