/**
 * PremiumBird - Large Centerpiece Hummingbird
 * 
 * Curated.media style:
 * - LARGE, prominent position (center-right of screen)
 * - Iridescent feather shaders
 * - Detailed wing animation
 * - Multiple feather layers for volume
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Iridescent shader - creates rainbow feather effect
const FEATHER_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vWing;
  
  uniform float uTime;
  uniform float uWingFlap;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    vec3 pos = position;
    
    // Wing flapping - affects sides
    float wingInfluence = smoothstep(0.15, 0.6, abs(position.x));
    float flap = sin(uTime * uWingFlap) * wingInfluence * 0.6;
    pos.y += flap;
    pos.z += sin(uTime * uWingFlap * 0.5) * wingInfluence * 0.2;
    
    vWing = wingInfluence;
    
    // Body breathing
    float breath = sin(uTime * 2.5) * 0.03;
    pos *= 1.0 + breath * (1.0 - wingInfluence);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FEATHER_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vWing;
  
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uHighlightColor;
  
  // Rainbow iridescence
  vec3 iridescence(float angle, float intensity) {
    vec3 c1 = vec3(0.5, 0.3, 1.0);  // Purple
    vec3 c2 = vec3(0.3, 0.7, 1.0);  // Cyan
    vec3 c3 = vec3(1.0, 0.5, 0.8);  // Pink
    
    float t = fract(angle * 2.0 + uTime * 0.3);
    vec3 col = mix(c1, c2, smoothstep(0.0, 0.5, t));
    col = mix(col, c3, smoothstep(0.5, 1.0, t));
    
    return col * intensity;
  }
  
  void main() {
    // View-dependent fresnel
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
    
    // Base feather color with gradient
    vec3 featherColor = mix(uBaseColor, uHighlightColor, vUv.y * 0.5 + vWing * 0.3);
    
    // Add iridescence
    float iriAngle = dot(vNormal, viewDir) * 0.5 + 0.5;
    vec3 iri = iridescence(iriAngle + vUv.x, fresnel);
    
    vec3 color = featherColor + iri * 0.6;
    
    // Rim glow (like curated.media bird)
    color += vec3(0.8, 0.9, 1.0) * fresnel * 0.5;
    
    // Feather pattern (subtle stripes)
    float pattern = sin(vUv.y * 60.0 + vUv.x * 20.0) * 0.5 + 0.5;
    color = mix(color * 0.9, color * 1.1, pattern * 0.15);
    
    gl_FragColor = vec4(color, 0.95);
  }
`;

// Create detailed bird body
function createBirdBody() {
  const geo = new THREE.SphereGeometry(1, 48, 36);
  const positions = geo.attributes.position;
  
  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);
    
    // Stretch into bird shape: narrow head, plump body, tapered tail
    const zNorm = (z + 1) / 2; // 0 at back, 1 at front
    
    // Body width (wider in middle)
    const bodyWidth = 0.6 + 0.4 * Math.sin(zNorm * Math.PI);
    x *= bodyWidth;
    y *= bodyWidth * 0.8;
    
    // Elongate
    z *= 1.8;
    
    positions.setXYZ(i, x, y, z);
  }
  
  geo.computeVertexNormals();
  return geo;
}

// Create wing geometry (more detailed)
function createWingGeometry() {
  const shape = new THREE.Shape();
  
  // Hummingbird wing shape
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.05, 0.6, 0.2, 1.0, 0.15);
  shape.bezierCurveTo(1.3, 0.1, 1.5, 0.0, 1.6, -0.05);
  shape.bezierCurveTo(1.5, -0.1, 1.2, -0.12, 0.8, -0.1);
  shape.bezierCurveTo(0.4, -0.08, 0.2, -0.05, 0, 0);
  
  const geo = new THREE.ShapeGeometry(shape, 24);
  return geo;
}

// Tail feathers
function createTailGeometry() {
  const geo = new THREE.ConeGeometry(0.2, 1.2, 8);
  geo.rotateX(Math.PI / 2);
  return geo;
}

export function PremiumBird({ 
  position = [2, 0.5, -1],
  scale = 1.5,  // LARGER by default
  scrollProgress = 0
}) {
  const groupRef = useRef();
  const materialRef = useRef();
  const wingLeftRef = useRef();
  const wingRightRef = useRef();
  
  const bodyGeo = useMemo(() => createBirdBody(), []);
  const wingGeo = useMemo(() => createWingGeometry(), []);
  const tailGeo = useMemo(() => createTailGeometry(), []);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWingFlap: { value: 30.0 }, // Fast hummingbird wings
    uBaseColor: { value: new THREE.Color('#4f46e5') }, // Indigo
    uHighlightColor: { value: new THREE.Color('#a5b4fc') }, // Light indigo
  }), []);
  
  const wingUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWingFlap: { value: 35.0 },
    uBaseColor: { value: new THREE.Color('#818cf8') },
    uHighlightColor: { value: new THREE.Color('#e0e7ff') },
  }), []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Update shader time
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }
    
    // Wing flapping
    if (wingLeftRef.current && wingRightRef.current) {
      const flapAngle = Math.sin(time * 30) * 0.5;
      wingLeftRef.current.rotation.z = 0.2 + flapAngle;
      wingRightRef.current.rotation.z = -0.2 - flapAngle;
      
      // Update wing shader
      wingLeftRef.current.material.uniforms.uTime.value = time;
      wingRightRef.current.material.uniforms.uTime.value = time;
    }
    
    // Hovering motion
    const hoverY = Math.sin(time * 2.5) * 0.15;
    const hoverX = Math.sin(time * 1.8) * 0.08;
    
    groupRef.current.position.y = position[1] + hoverY;
    groupRef.current.position.x = position[0] + hoverX;
    
    // Subtle tilt
    groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.08;
    groupRef.current.rotation.x = Math.sin(time * 1.2) * 0.05;
    
    // Scroll parallax
    const scrollOffset = scrollProgress * 3;
    groupRef.current.position.z = position[2] - scrollOffset * 0.5;
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main body */}
      <mesh geometry={bodyGeo}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={FEATHER_VERTEX}
          fragmentShader={FEATHER_FRAGMENT}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Left wing */}
      <mesh 
        ref={wingLeftRef}
        geometry={wingGeo}
        position={[-0.6, 0.2, 0]}
        rotation={[0.3, 0, 0.2]}
        scale={[1.5, 1.2, 1]}
      >
        <shaderMaterial
          vertexShader={FEATHER_VERTEX}
          fragmentShader={FEATHER_FRAGMENT}
          uniforms={wingUniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Right wing */}
      <mesh 
        ref={wingRightRef}
        geometry={wingGeo}
        position={[0.6, 0.2, 0]}
        rotation={[0.3, Math.PI, -0.2]}
        scale={[1.5, 1.2, 1]}
      >
        <shaderMaterial
          vertexShader={FEATHER_VERTEX}
          fragmentShader={FEATHER_FRAGMENT}
          uniforms={wingUniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tail */}
      <mesh geometry={tailGeo} position={[0, -0.1, 1.5]} rotation={[0.1, 0, 0]}>
        <meshBasicMaterial color="#4338ca" transparent opacity={0.9} />
      </mesh>
      
      {/* Beak (long hummingbird beak) */}
      <mesh position={[0, 0.1, -2.2]} rotation={[-0.1, 0, 0]}>
        <coneGeometry args={[0.05, 0.8, 8]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.3, 0.25, -1.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.3, 0.25, -1.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Eye highlights */}
      <mesh position={[-0.32, 0.28, -1.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.28, 0.28, -1.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Glow light */}
      <pointLight color="#a78bfa" intensity={3} distance={10} decay={2} />
      <pointLight color="#6366f1" intensity={2} distance={8} decay={2} position={[0, 0, -1]} />
    </group>
  );
}

export default PremiumBird;
