/**
 * IntelligencePipeline v2 - True Data Storytelling Cinema
 * 
 * WHAT THE USER MUST SEE:
 * 1. Data entering from multiple sources (ingestion)
 * 2. Data visibly dying at filter gate (AI filtering)
 * 3. Survivors sorting into lanes (organization)
 * 4. Trends competing and collapsing (competition)
 * 5. One insight standing victorious (clarity)
 * 
 * Every frame explains computation.
 */

import React from 'react';
import DataIngestion from './DataIngestion';
import ScrutinyGate from './FilterGate'; // File still named FilterGate
import SortingLanes from './SortingLanes';
import TrendBubbles from './TrendBubbles';
import DominantInsight from './DominantInsight';

export function IntelligencePipeline({ 
  scrollProgress = 0,
  cursorX = 0,
  cursorY = 0 
}) {
  // Act visibility (with overlaps for smooth transitions)
  const showIngestion = scrollProgress < 0.35;      // ACT I: 0-35%
  const showFilter = scrollProgress > 0.1 && scrollProgress < 0.55;   // ACT II: 10-55%
  const showLanes = scrollProgress > 0.3 && scrollProgress < 0.75;    // ACT III: 30-75%
  const showBubbles = scrollProgress > 0.5 && scrollProgress < 0.95;  // ACT IV: 50-95%
  const showDominant = scrollProgress > 0.75;       // ACT V: 75-100%
  
  // Environment darkening for final act
  const clarityDimming = Math.max(0, (scrollProgress - 0.85) / 0.15);
  
  return (
    <group>
      {/* ACT I: Data Ingestion - Directional packet inflow */}
      <DataIngestion 
        scrollProgress={scrollProgress}
        visible={showIngestion}
      />
      
      {/* ACT II: Scrutiny Gate - The Trial of Data */}
      <ScrutinyGate
        scrollProgress={scrollProgress}
        visible={showFilter}
      />
      
      {/* ACT III: Sorting Lanes - Pipeline organization */}
      <SortingLanes
        scrollProgress={scrollProgress}
        visible={showLanes}
      />
      
      {/* ACT IV: Trend Bubbles - Competition phase */}
      <TrendBubbles
        scrollProgress={scrollProgress}
        visible={showBubbles}
      />
      
      {/* ACT V: Dominant Insight - The winner */}
      <DominantInsight
        scrollProgress={scrollProgress}
        visible={showDominant}
      />
      
      {/* Ambient lighting - dims during clarity phase */}
      <ambientLight intensity={0.12 * (1 - clarityDimming * 0.5)} />
      
      {/* Directional light - follows the journey */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3 + scrollProgress * 0.2}
        color="#a78bfa"
      />
      
      {/* Central glow - increases toward insight */}
      <pointLight
        position={[0, 0, 2]}
        color="#7c3aed"
        intensity={scrollProgress * 1.5}
        distance={20}
        decay={2}
      />
    </group>
  );
}

export default IntelligencePipeline;
