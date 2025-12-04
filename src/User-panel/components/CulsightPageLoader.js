import React from 'react';
import GIF from "../assests/Black White Simple Modern Neon Griddy Bold Technology Pixel Electronics Store Logo (5).mp4"

function CulsightPageLoader() {
  return (
    <div style={{ display: "block", textAlign: "center", padding: "50px" }}>
      {/* <div style={{
        display: "inline-block",
        padding: "20px",
        minWidth: "180px",
        boxShadow: "0px 0px 8px #ccc",
        borderRadius: "8px"
      }}> */}
        
        <video
          src={GIF}  
          alt="loading"
          style={{ width: "120px", height: "120px",borderRadius:"10px" }}
        />
{/* 
      </div> */}
    </div>
  );
}

export default CulsightPageLoader;
