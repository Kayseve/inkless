// camera.js
// One job: turn on the webcam and show it in a <video> element.

/**
 * Asks the browser for webcam access and plugs the camera into `videoElement`.
 * Returns a Promise that finishes once the video is actually playing,
 * so the caller knows real frames are ready to read.
 *
 * `async` means this function does slow work (waiting for permission, waiting
 * for the camera to warm up) without freezing the page. Callers use `await`.
 */
export async function startCamera(videoElement) {
  // navigator.mediaDevices.getUserMedia is the browser's built-in camera API.
  // This line is what makes the "Allow camera?" popup appear.
  // It only works on localhost or https:// sites (a browser security rule).
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,              // 640x480 is plenty for hand tracking and keeps it fast
      height: 480,
      facingMode: 'user',      // 'user' = front/selfie camera (matters on phones)
    },
    audio: false,              // we never need the microphone
  });

  // A "stream" is a live feed of frames. Giving it to the <video> makes it display.
  videoElement.srcObject = stream;

  // Wait until the video knows its size and has started playing.
  // Until then, videoWidth/videoHeight are 0 and MediaPipe would have nothing to read.
  await new Promise((resolve) => {
    videoElement.onloadeddata = () => resolve();
  });
  await videoElement.play();
}
