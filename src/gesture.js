// gesture.js
// ✋ THIS IS YOUR FILE. Your pinch / fist / smoothing logic goes here.
//
// main.js calls detectGesture() once per video frame (~30 times a second)
// whenever a hand is visible.

/*
  THE 21 HAND LANDMARKS (MediaPipe's numbering)

  `landmarks` is an array of 21 points. Each point is { x, y, z }:
    x → 0 at the left edge of the video, 1 at the right edge
    y → 0 at the top,                     1 at the bottom   (yes, y grows DOWNWARD)
    z → depth; more negative = closer to the camera

    0  = wrist

    Thumb:          1 (base) → 2 → 3 → 4  (TIP)
    Index finger:   5 (knuckle) → 6 → 7 → 8  (TIP)
    Middle finger:  9 → 10 → 11 → 12 (tip)
    Ring finger:   13 → 14 → 15 → 16 (tip)
    Pinky:         17 → 18 → 19 → 20 (tip)

  The two you'll care about first:
    landmarks[4] → THUMB TIP
    landmarks[8] → INDEX FINGERTIP

  Hint for later: a "pinch" is when those two points get close together.
*/

export function detectGesture(landmarks) {
  // For now, just print the landmarks so you can see the raw data.
  // Open the browser console to see them: Cmd + Option + J in Chrome.
  // (This prints ~30 times a second, so expect a fast-scrolling list!)
  console.log(landmarks);
}
