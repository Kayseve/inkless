// handTracker.js
// One job: load Google's MediaPipe hand model, then answer
// "here's a video frame, where are the hand points?"

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// MediaPipe needs two things downloaded at runtime:
//
// 1. The "WASM" engine — compiled code that runs the AI model fast in the browser.
//    The version in this URL MUST match the version in package.json (1.2.3),
//    otherwise the JavaScript and the engine might not understand each other.
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.3/wasm';

// 2. The trained model itself — a file containing what the AI "learned" about hands.
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

/**
 * Downloads the engine + model and returns a ready-to-use HandLandmarker.
 * This takes a second or two the first time (it's downloading a few MB).
 */
export async function createHandTracker() {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL);

  return HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate: 'GPU',         // use the graphics chip for speed (falls back to CPU if needed)
    },
    runningMode: 'VIDEO',      // we'll feed it a stream of frames, not single photos
    numHands: 1,               // track only one hand — simpler and faster
  });
}

/**
 * Runs the model on the current video frame.
 * Returns an array of 21 landmark points for the first hand found,
 * or null if no hand is visible.
 *
 * Each landmark looks like { x, y, z }:
 *   x: 0 = left edge of the video, 1 = right edge
 *   y: 0 = top edge,              1 = bottom edge
 *   z: depth (smaller = closer to the camera), roughly relative to the wrist
 */
export function findHand(handTracker, videoElement) {
  // detectForVideo needs a timestamp so it can tell frames apart and track smoothly.
  // performance.now() = milliseconds since the page loaded.
  const result = handTracker.detectForVideo(videoElement, performance.now());

  // result.landmarks is a list of hands; each hand is a list of 21 points.
  // We asked for 1 hand, so we take the first one (index 0), if there is one.
  if (result.landmarks.length > 0) {
    return result.landmarks[0];
  }
  return null;
}
