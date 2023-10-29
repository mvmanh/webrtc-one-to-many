const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");

let senderStream;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {

    console.log('New consumer requested')

    const peer = new webrtc.RTCPeerConnection({
        iceServers: [{ urls: [ "stun:ss-turn1.xirsys.com" ]}, {   username: "84B9tUvDm5vHM780N2N7bB723gnWaoA9mgJ0QIH5Fg5x72wfeZaDHKtXAdY8GhTxAAAAAGU9viptdm1hbmg=",   credential: "c91a3e0a-75ff-11ee-8961-0242ac140004",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {

    console.log('New broadcaster requested')

    const peer = new webrtc.RTCPeerConnection({
        iceServers: [{ urls: [ "stun:ss-turn1.xirsys.com" ]}, {   username: "84B9tUvDm5vHM780N2N7bB723gnWaoA9mgJ0QIH5Fg5x72wfeZaDHKtXAdY8GhTxAAAAAGU9viptdm1hbmg=",   credential: "c91a3e0a-75ff-11ee-8961-0242ac140004",   urls: [       "turn:ss-turn1.xirsys.com:80?transport=udp",       "turn:ss-turn1.xirsys.com:3478?transport=udp",       "turn:ss-turn1.xirsys.com:80?transport=tcp",       "turn:ss-turn1.xirsys.com:3478?transport=tcp",       "turns:ss-turn1.xirsys.com:443?transport=tcp",       "turns:ss-turn1.xirsys.com:5349?transport=tcp"   ]}]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};


app.listen(process.env.PORT || 5000, () => console.log('server started'));
