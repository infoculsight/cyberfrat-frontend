import React from 'react';
import GIF from "../assests/02176467793810900000000000000000000ffffac1514363c9e40-ezgif.com-video-to-gif-converter.gif"

function CulsightPageLoader() {
  return (
    <div style={{ display: "block", textAlign: "center", padding: "50px" }}>
      <div style={{
        display: "inline-block",
        padding: "20px",
        minWidth: "180px",
        boxShadow: "0px 0px 8px #ccc",
        borderRadius: "8px"
      }}>
        
        <img 
          src={GIF}  
          alt="loading"
          style={{ width: "80px", height: "80px" }}
        />

      </div>
    </div>
  );
}

export default CulsightPageLoader;
