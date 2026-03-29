/**
 * FlightPath.js
 * 
 * Defines the cinematic spline path for the Trend Intelligence Avatar.
 * The path winds through the page sections in a 3D coordinate space.
 * 
 * Coordinate System (Approximate):
 * Hero: [0, 0, 0]
 * Features: [0, -10, 0]
 * Use Cases: [0, -20, 0]
 * CTA: [0, -30, 0]
 */

import * as THREE from 'three';

// Control points for the CatmullRom curve
const POINTS = [
  // ACT I: Hero Arrival (Swoop in from top-right-depth)
  new THREE.Vector3(8, 5, -10),    // Start far/high
  new THREE.Vector3(2, 1, -2),     // Swoop in
  new THREE.Vector3(0, 0, 0),      // Hero center focus
  
  // ACT II: Features (Wide orbit/scan)
  new THREE.Vector3(-4, -4, 2),    // Swing left
  new THREE.Vector3(3, -8, -3),    // Swing right behind content
  new THREE.Vector3(0, -10, 0),    // Center features
  
  // ACT III: Use Cases (Tight/Fast focus)
  new THREE.Vector3(-2, -14, -1),  // Dive
  new THREE.Vector3(0, -18, 0),    // Use cases center
  
  // ACT V: CTA (Ascend to clarity)
  new THREE.Vector3(3, -24, 2),    // Swing up
  new THREE.Vector3(4, -28, 1),    // Center approach right
  new THREE.Vector3(5, -30, 2)     // Final resting pose (RIGHT side, balancing text)
];

// Create the curve
export const FLIGHT_PATH = new THREE.CatmullRomCurve3(POINTS);
FLIGHT_PATH.tension = 0.5; // Smoothness

/**
 * Get position and tangent at specific progress (0-1)
 */
export function getFlightData(progress) {
  // Clamp progress
  const t = Math.max(0, Math.min(1, progress));
  
  const position = FLIGHT_PATH.getPointAt(t);
  const tangent = FLIGHT_PATH.getTangentAt(t).normalize();
  
  return { position, tangent };
}

/**
 * Get camera target position (lagging behind entity)
 */
export function getCameraTarget(progress) {
  // Camera looks slightly ahead of the bird? No, usually follows *it*.
  // Or looks at a point slightly ahead of the bird on the curve.
  const t = Math.max(0, Math.min(1, progress));
  return FLIGHT_PATH.getPointAt(t);
}
