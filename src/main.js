// main.js
// The conductor: starts the camera, loads the hand model, and runs the
// frame-by-frame loop that ties everything together.

import { startCamera } from './camera.js';
import { createHandTracker, findHand } from './handTracker.js';
import { detectGesture } from './gesture.js';

// ---------- Grab the elements from index.html ----------
// document.getElementById finds an element by the id="..." we gave it in the HTML.
const video = document.getElementById('webcam');
const statusText = document.getElementById('status');
const stage = document.getElementById('stage');

const landmarkCanvas = document.getElementById('landmark-canvas');
const drawingCanvas = document.getElementById('drawing-canvas');

// A canvas by itself is just a blank rectangle. To draw on it we ask for its
// "2d context" — an object full of drawing tools (circles, lines, colours...).
const landmarkCtx = landmarkCanvas.getContext('2d');
const drawingCtx = drawingCanvas.getContext('2d'); // your ink layer — unused for now

// ---------- Start everything ----------
async function start() {
  try {
    statusText.textContent = 'Asking for camera permission…';
    await startCamera(video);

    // Make the canvases' drawing area exactly the same size as the video's pixels.
    // (A canvas has two sizes: its CSS display size, and its internal pixel grid.
    //  We set the pixel grid here so 1 canvas pixel = 1 video pixel.)
    landmarkCanvas.width = drawingCanvas.width = video.videoWidth;
    landmarkCanvas.height = drawingCanvas.height = video.videoHeight;

    // Make the stage the same shape as the camera, so nothing gets stretched
    // and the dots line up exactly with your hand.
    stage.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;

    statusText.textContent = 'Loading hand model…';
    const handTracker = await createHandTracker();

    statusText.textContent = 'Show me your hand ✋';
    loop(handTracker);
  } catch (error) {
    // If anything above fails (camera blocked, no internet for the model...), show why.
    console.error(error);
    statusText.textContent = `Something went wrong: ${error.message}`;
  }
}

// ---------- The frame loop ----------
function loop(handTracker) {
  // 1. Ask MediaPipe where the hand is in the current video frame.
  const landmarks = findHand(handTracker, video);

  // 2. Wipe the dots from the previous frame (the drawing canvas is NOT wiped).
  landmarkCtx.clearRect(0, 0, landmarkCanvas.width, landmarkCanvas.height);

  // 3. If a hand was found, draw its dots and hand it to your gesture code.
  if (landmarks) {
    drawLandmarks(landmarks);
    detectGesture(landmarks);
  }

  // 4. Ask the browser to call loop() again right before the next screen refresh
  //    (usually 60 times a second). This is the standard way to animate on the web.
  requestAnimationFrame(() => loop(handTracker));
}

// ---------- Drawing the 21 dots ----------
function drawLandmarks(landmarks) {
  landmarkCtx.fillStyle = '#00e5ff'; // cyan dots

  for (const point of landmarks) {
    // MediaPipe gives x and y as fractions (0 to 1).
    // Multiply by the canvas size to get real pixel positions.
    const x = point.x * landmarkCanvas.width;
    const y = point.y * landmarkCanvas.height;

    landmarkCtx.beginPath();
    landmarkCtx.arc(x, y, 5, 0, Math.PI * 2); // a full circle with radius 5px
    landmarkCtx.fill();
  }
}

start();
