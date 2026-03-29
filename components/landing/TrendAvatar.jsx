/**
 * TrendAvatar - The Hero Entity
 * 
 * A single, organic, luminous form that acts as the "Ghost in the Machine".
 * It travels the FlightPath, reacting to scroll.
 * 
 * Visuals:
 * - Ribbon/Stream trail geometry
 * - Custom shader for "living data" (flowing energy)
 * - Morphs shape slightly based on speed/section
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FLIGHT_PATH, getFlightData } from './FlightPath';
import { isMobileDevice } from '../../motion/uiCapabilities';

// Shader for the living data skin
const AVATAR_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vNoise;
  
  uniform float uTime;
  uniform float uSpeed;
  
  // Simple simplex noise (omitted full implementation for brevity, using sin waves)
  float noise(vec3 p) {
    return sin(p.x * 2.0 + uTime) * sin(p.y * 3.0 + uTime) * sin(p.z * 1.5 + uTime);
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // "Breathing" / Organic ripple
    float breath = sin(uTime * 2.0 + pos.x * 2.0) * 0.1;
    
    // Speed deformation (stretch when fast)
    pos.z *= 1.0 + uSpeed * 0.5;
    
    // Organic noise displacement
    float n = noise(pos * 2.0 + uTime);
    vNoise = n;
    pos += normal * n * 0.15;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const AVATAR_FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vNoise;
  
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  
  void main() {
    // Flowing energy pattern
    float flow = sin(vUv.x * 20.0 - uTime * 5.0) * 0.5 + 0.5;
    
    // Rim light effect
    vec3 viewDir = normalize(cameraPosition - vNormal); // Approximation
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    rim = pow(rim, 3.0);
    
    // Mix colors based on noise and flow
    vec3 color = mix(uColorA, uColorB, flow * 0.5 + vNoise * 0.5);
    
    // Add rim glow
    color += vec3(1.0) * rim * 0.8;
    
    gl_FragColor = vec4(color, uOpacity * (0.6 + rim * 0.4));
  }
`;

export function TrendAvatar({ scrollProgress = 0, visible = true }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const isMobile = isMobileDevice();
  
  // Geometry: A Ribbon/Wing shape
  // We use a Tube or formatted Plane. Let's use a TubeGeometry along a small curve? 
  // Or simpler: A deformed Sphere/Capsule heavily modified by shader.
  // Ribbon is best. Let's use a Plane with high segments and curve it in vertex shader? 
  // No, let's use a "Trail" mesh.
  // Actually, a deformed Sphere squeezed flat looks like a Manta Ray/Chip.
  
  const geometry = useMemo(() => {
    // A flat, wide capsule - distinct "Entity" shape
    return new THREE.SphereGeometry(1, 64, 32); 
    // We scale it to be flat and wide in useFrame
  }, []);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uColorA: { value: new THREE.Color('#7c3aed') }, // Deep Purple
    uColorB: { value: new THREE.Color('#22d3ee') }, // Cyan
    uOpacity: { value: 0.9 },
  }), []);
  
  // Smoothed position for camera follow interaction
  const positionRef = useRef(new THREE.Vector3());
  const rotationRef = useRef(new THREE.Quaternion());
  
  useFrame((state, delta) => {
    if (!meshRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    // 1. Calculate Path Position based on Scroll
    // Add slight lag/lerp to scrollProgress for "weight"
    const t = scrollProgress; 
    const { position, tangent } = getFlightData(t);
    
    // 2. Physics / smoothing (Lerp towards target path point)
    positionRef.current.lerp(position, 0.1); // Smooth follow
    
    // 3. Orientation (Look ahead)
    const lookTarget = position.clone().add(tangent);
    const dummy = new THREE.Object3D();
    dummy.position.copy(positionRef.current);
    dummy.lookAt(lookTarget);
    
    // Apply Rotation Smoothing
    meshRef.current.quaternion.slerp(dummy.quaternion, 0.1);
    meshRef.current.position.copy(positionRef.current);
    
    // 4. Shape Morphing (The "Live" feeling)
    // Flatten it to look like a ray/wing
    meshRef.current.scale.set(1.5, 0.2, 2.5); 
    
    // 5. Update Shader
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      // Calculate speed proxy (delta of pos?)
      materialRef.current.uniforms.uSpeed.value = 0.5; // Todo dynamic
    }
  });

  if (!visible) return null;

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={AVATAR_VERTEX_SHADER}
          fragmentShader={AVATAR_FRAGMENT_SHADER}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={uniforms}
        />
      </mesh>
      
      {/* Light emitted by the entity */}
      <pointLight 
        ref={(l) => l && (l.position.copy(meshRef.current?.position || new THREE.Vector3()))} 
        color="#a78bfa" 
        intensity={2} 
        distance={10} 
        decay={2} 
      />
    </group>
  );
}

export default TrendAvatar;
