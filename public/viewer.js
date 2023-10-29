window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}

async function init() {
    const peer = createPeer();
    peer.addTransceiver("video", { direction: "recvonly" })
    console.log('init()')
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [{   urls: [ "stun:ss-turn1.xirsys.com" ]}, {   username: "84B9tUvDm5vHM780N2N7bB723gnWaoA9mgJ0QIH5Fg5x72wfeZaDHKtXAdY8GhTxAAAAAGU9viptdm1hbmg=",   credential: "c91a3e0a-75ff-11ee-8961-0242ac140004",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}]
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
    console.log('createPeer()')
    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    console.log('handleNegotiationNeededEvent()')
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/consumer', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("video").srcObject = e.streams[0];
};

