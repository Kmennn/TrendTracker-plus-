import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const CommunityDetection = () => {
  const fgRef = useRef();

  const data = {
    nodes: [
      // Schools of Thought
      { id: 'Existentialism', val: 30, color: '#c7a7d4' },
      { id: 'Stoicism', val: 25, color: '#a7c7d4' },
      { id: 'Absurdism', val: 20, color: '#d4a7a7' },
      { id: 'Nihilism', val: 15, color: '#a7d4c7' },
      { id: 'Humanism', val: 35, color: '#d4c7a7' },

      // Thinkers and Concepts
      { id: 'Sartre', val: 10, group: 'Existentialism', color: '#c7a7d4' },
      { id: 'Camus', val: 10, group: 'Absurdism', color: '#d4a7a7' },
      { id: 'Seneca', val: 10, group: 'Stoicism', color: '#a7c7d4' },
      { id: 'Nietzsche', val: 10, group: 'Nihilism', color: '#a7d4c7' },
      { id: 'Erasmus', val: 10, group: 'Humanism', color: '#d4c7a7' },
    ],
    links: [
      // Connections between thinkers and schools
      { source: 'Existentialism', target: 'Sartre' },
      { source: 'Absurdism', target: 'Camus' },
      { source: 'Stoicism', target: 'Seneca' },
      { source: 'Nihilism', target: 'Nietzsche' },
      { source: 'Humanism', target: 'Erasmus' },

      // Connections between schools of thought
      { source: 'Existentialism', target: 'Absurdism' },
      { source: 'Existentialism', target: 'Nihilism' },
      { source: 'Stoicism', target: 'Humanism' },
    ],
  };

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ z: 300 });
      const controls = fgRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 rounded-xl p-8 mb-8 h-[600px] border border-gray-700/50 relative"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-6 z-10 relative">
        Schools of Thought
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-400 mb-8 z-10 relative">
        An abstract representation of ideological communities.
      </motion.p>
      <div className="absolute top-0 left-0 w-full h-full">
        <ForceGraph3D
          ref={fgRef}
          graphData={data}
          backgroundColor="rgba(0,0,0,0)"
          nodeThreeObject={node => {
            const geometry = new THREE.SphereGeometry(Math.max(0.5, node.val / 5));
            const material = new THREE.MeshPhongMaterial({
              color: node.color,
              transparent: true,
              opacity: 0.8,
              shininess: 90,
            });
            return new THREE.Mesh(geometry, material);
          }}
          nodeLabel="id"
          linkLabel={link => `${link.source.id} - ${link.target.id}`}
          linkWidth={0.3}
          linkColor={() => 'rgba(255, 255, 255, 0.3)'}
          linkDirectionalParticles={1}
          linkDirectionalParticleWidth={0.5}
          linkDirectionalParticleColor={() => 'rgba(255, 255, 255, 0.5)'}
        />
      </div>
    </motion.div>
  );
};

export default CommunityDetection;
