import React, { useState, useEffect } from 'react';

const ProjectileMotionEmoji = ({ endPosition }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
   // Fixed end point

  // Randomly generate initial position and velocity on component mount
  useEffect(() => {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    const randomVx = Math.random() * 2 + 5; // Adjust velocity range as needed
    const randomVy = Math.random() * 2 - 5; // Adjust velocity range as needed

    setPosition({ x: randomX, y: randomY });
    setVelocity({ x: randomVx, y: randomVy });
  }, []);

  // Update position on each frame using requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y,
      }));

      // Apply gravity or any other forces if needed
      // Example: setVelocity({ x: velocity.x, y: velocity.y + gravity });

      // Stop animation when the emoji reaches the end point
      if (position.x >= endPosition.x && position.y <= endPosition.y) {
        return;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [position, velocity]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        fontSize: '2rem',
      }}
    >
      🚀
    </div>
  );
};

export default ProjectileMotionEmoji;
