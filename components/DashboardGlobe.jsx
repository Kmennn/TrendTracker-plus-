import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const DashboardGlobe = () => {
  const globeEl = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  // This effect runs once to set up the resize listener.
  useEffect(() => {
    handleResize(); // Set the initial size
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // This effect runs whenever the size changes, to set up the globe controls.
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, [size]); // This depends on `size`.

  // Generate random data for the globe points
  const gData = [...Array(20).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 3,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
  }));

  return (
    // The pointerEvents style is added to prevent this component from capturing mouse events
    <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Render the Globe component only when the container has a width */}
      {size.width > 0 && <Globe
        ref={globeEl}
        width={size.width}
        height={size.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        pointsData={gData}
        pointAltitude="size"
        pointColor="color"
        backgroundColor="rgba(0,0,0,0)"
      />}
    </div>
  );
}

export default DashboardGlobe;
