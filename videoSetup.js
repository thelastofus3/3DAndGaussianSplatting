export const initializeAgora = async (appId, channel, uid) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await client.join(appId, channel, null, uid);

    const cameraConfig = {
        encoderConfig: {
            width: 1920,
            height: 1080,
            frameRate: 30,
            bitrateMin: 1000,
            bitrateMax: 2500,
            orientationMode: 'adaptative'
        },
        optimizationMode: 'detail',
        facingMode: 'user'
    };

    const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(undefined, cameraConfig);
    const videoElement = document.createElement("video");
    videoElement.srcObject = new MediaStream([
        localTracks[1].getMediaStreamTrack(),
    ]);
    videoElement.play();

    return videoElement;
};
