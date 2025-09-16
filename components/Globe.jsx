
import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import './Globe.css'; // Import the new CSS file

const World = () => {
  const globeEl = useRef();

  useEffect(() => {
    // Set up the globe
    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }); // Adjust the altitude to make the globe smaller
  }, []);

  // Generate random data points
  const gData = [...Array(30).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 4,
  }));

  return (
    <div className="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        pointsData={gData}
        pointAltitude="size"
        pointColor={() => '#4c51bf'}
        width={300} // Set the width of the globe
        height={300} // Set the height of the globe
        backgroundColor="rgba(0,0,0,0)" // Make the background transparent
      />
    </div>
  );
}

export default World;
