/**
 * TrendHummingbird - Animated 3D Hummingbird
 * 
 * Inspired by curated.media's ethereal bird.
 * Stylized hummingbird with wing-flapping animation.
 * Follows scroll for parallax effect.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for organic wing movement
const BIRD_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vWingFactor;
  
  uniform float uTime;
  uniform float uFlapSpeed;
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Wing flapping based on x position (wings are on sides)
    float wingInfluence = smoothstep(0.0, 0.5, abs(position.x));
    float flap = sin(uTime * uFlapSpeed) * wingInfluence * 0.4;
    pos.y += flap;
    
    // Subtle body breathing
    float breath = sin(uTime * 2.0) * 0.02;
    pos *= 1.0 + breath;
    
    vWingFactor = wingInfluence;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for iridescent feathers
const BIRD_FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vWingFactor;
  
  uniform float uTime;
  uniform vec3 uColorBody;
  uniform vec3 uColorWing;
  uniform vec3 uColorHighlight;
  uniform float uOpacity;
  
  void main() {
    // Fresnel rim effect for iridescence
    vec3 viewDir = normalize(cameraPosition);
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    rim = pow(rim, 2.5);
    
    // Color gradient body to wing tips
    vec3 baseColor = mix(uColorBody, uColorWing, vWingFactor);
    
    // Iridescent shimmer
    float shimmer = sin(vUv.x * 30.0 + uTime * 3.0) * 0.5 + 0.5;
    vec3 iridescent = mix(baseColor, uColorHighlight, shimmer * rim * 0.5);
    
    // Final color with glow
    vec3 finalColor = iridescent + vec3(1.0) * rim * 0.4;
    
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

export function TrendHummingbird({ 
  scrollProgress = 0, 
  visible = true,
  position = [3, 1, -2]
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const materialRef = useRef();
  
  // Hummingbird body geometry (elongated sphere)
  const bodyGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.3, 32, 24);
    // Stretch for bird body shape
    geo.scale(1, 0.6, 1.8);
    return geo;
  }, []);
  
  // Wing geometry (flat stretched ellipse)
  const wingGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.25, 16, 16);
    geo.scale(1.5, 0.08, 0.8);
    return geo;
  }, []);
  
  // Tail geometry
  const tailGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.1, 0.5, 8);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);
  
  // Beak geometry
  const beakGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.03, 0.25, 8);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);
  
  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uFlapSpeed: { value: 25.0 }, // Fast hummingbird wing beats
    uColorBody: { value: new THREE.Color('#7c3aed') },    // Purple
    uColorWing: { value: new THREE.Color('#a78bfa') },    // Light purple
    uColorHighlight: { value: new THREE.Color('#22d3ee') }, // Cyan iridescence
    uOpacity: { value: 0.95 },
  }), []);
  
  // Wing material (separate for faster flapping shader)
  const wingUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uFlapSpeed: { value: 35.0 },
    uColorBody: { value: new THREE.Color('#a78bfa') },
    uColorWing: { value: new THREE.Color('#c4b5fd') },
    uColorHighlight: { value: new THREE.Color('#22d3ee') },
    uOpacity: { value: 0.85 },
  }), []);
  
  // Animation and parallax
  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    // Update shader time
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }
    
    // Hovering motion
    const hoverY = Math.sin(time * 2) * 0.15;
    const hoverX = Math.sin(time * 1.5) * 0.1;
    
    // Scroll-based parallax movement
    const scrollOffset = scrollProgress * 3;
    
    groupRef.current.position.set(
      position[0] + hoverX,
      position[1] + hoverY - scrollOffset * 0.5,
      position[2] + scrollOffset * 0.3
    );
    
    // Slight rotation based on movement
    groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.1;
    groupRef.current.rotation.y = Math.PI * 0.2 + Math.sin(time * 0.5) * 0.1;
  });
  
  if (!visible) return null;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh geometry={bodyGeometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={BIRD_VERTEX_SHADER}
          fragmentShader={BIRD_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Left Wing */}
      <mesh 
        geometry={wingGeometry} 
        position={[-0.35, 0.05, 0]}
        rotation={[0, 0, 0.3]}
      >
        <shaderMaterial
          vertexShader={BIRD_VERTEX_SHADER}
          fragmentShader={BIRD_FRAGMENT_SHADER}
          uniforms={wingUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Right Wing */}
      <mesh 
        geometry={wingGeometry} 
        position={[0.35, 0.05, 0]}
        rotation={[0, 0, -0.3]}
      >
        <shaderMaterial
          vertexShader={BIRD_VERTEX_SHADER}
          fragmentShader={BIRD_FRAGMENT_SHADER}
          uniforms={wingUniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Tail */}
      <mesh geometry={tailGeometry} position={[0, -0.05, 0.45]}>
        <meshBasicMaterial 
          color="#6d28d9" 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Beak */}
      <mesh geometry={beakGeometry} position={[0, 0, -0.45]}>
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      
      {/* Glow light */}
      <pointLight 
        color="#a78bfa" 
        intensity={1.5} 
        distance={5} 
        decay={2} 
      />
    </group>
  );
}

export default TrendHummingbird;
