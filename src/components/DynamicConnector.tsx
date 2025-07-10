"use client";

import React from 'react';

interface DynamicConnectorProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

const DynamicConnector = ({ start, end }: DynamicConnectorProps) => {
  const strokeWidth = 2; // Line thickness
  const ballRadius = 4; // Radius of the ball points

  // Calculate SVG dimensions and position
  const minX = Math.min(start.x, end.x) - ballRadius;
  const minY = Math.min(start.y, end.y) - ballRadius;
  const maxX = Math.max(start.x, end.x) + ballRadius;
  const maxY = Math.max(start.y, end.y) + ballRadius;

  const width = maxX - minX;
  const height = maxY - minY;

  // Adjust start and end points relative to the SVG's new top-left corner
  const adjustedStart = { x: start.x - minX, y: start.y - minY };
  const adjustedEnd = { x: end.x - minX, y: end.y - minY };

  return (
    <div
      style={{
        position: 'absolute',
        left: minX,
        top: minY,
        width: width,
        height: height,
        pointerEvents: 'none', // Ensure it doesn't block clicks
        zIndex: 10, // Behind narrative beats, but above background
      }}
    >
      <svg width={width} height={height}>
        {/* Connector Path */}
        <path
          d={(() => {
            const cornerRadius = 8; // Radius for rounded corners

            let pathD = `M ${adjustedStart.x},${adjustedStart.y}`;

            if (adjustedStart.x === adjustedEnd.x || adjustedStart.y === adjustedEnd.y) {
              // Straight line if perfectly vertical or horizontal
              pathD += `L ${adjustedEnd.x},${adjustedEnd.y}`;
            } else {
              // Needs a 90-degree bend with rounded corner (vertical-then-horizontal)
              const cornerX = adjustedStart.x;
              const cornerY = adjustedEnd.y;

              // Ensure there's enough space for the corner radius
              const effectiveCornerRadius = Math.min(
                cornerRadius,
                Math.abs(adjustedEnd.y - adjustedStart.y) / 2, // Half the vertical distance
                Math.abs(adjustedEnd.x - adjustedStart.x) / 2   // Half the horizontal distance
              );

              // Point before the corner on the vertical segment
              const pVerticalBeforeCornerY = cornerY - effectiveCornerRadius * Math.sign(adjustedEnd.y - adjustedStart.y);
              pathD += `L ${adjustedStart.x},${pVerticalBeforeCornerY}`;

              // Arc to the point after the corner on the horizontal segment
              const pHorizontalAfterCornerX = cornerX + effectiveCornerRadius * Math.sign(adjustedEnd.x - adjustedStart.x);
              const sweepFlag = (adjustedEnd.x - adjustedStart.x) * (adjustedEnd.y - adjustedStart.y) > 0 ? 1 : 0; // Determine sweep direction

              pathD += `A ${effectiveCornerRadius},${effectiveCornerRadius} 0 0 ${sweepFlag} ${pHorizontalAfterCornerX},${cornerY}`;

              // Horizontal segment to the end point
              pathD += `L ${adjustedEnd.x},${adjustedEnd.y}`;
            }
            return pathD;
          })()}
          stroke="#78716c" // stone-600
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Start Ball Point */}
        <circle 
          cx={adjustedStart.x} 
          cy={adjustedStart.y} 
          r={ballRadius} 
          fill="#a8a29e" // stone-400
          stroke="#78716c" // stone-600
          strokeWidth={strokeWidth / 2}
        />
        {/* End Ball Point */}
        <circle 
          cx={adjustedEnd.x} 
          cy={adjustedEnd.y} 
          r={ballRadius} 
          fill="#a8a29e" // stone-400
          stroke="#78716c" // stone-600
          strokeWidth={strokeWidth / 2}
        />
      </svg>
    </div>
  );
};

export default DynamicConnector;