import { Spin } from 'antd'
import React from 'react'
import { LoadingOutlined } from "@ant-design/icons";

function CulsightPageLoader() {
  return (
     <div style={{display:"bloack",textAlign:"center",padding:"50px"}}>
       <div style={{display:"inline-block", padding:"20px",minWidth:"180px", boxShadow:"0px 0px 8px #FFC93F", borderRadius:"8px"}}>
         <Spin indicator={<LoadingOutlined spin />} style={{color:"#FFC93F"}} size="large"/>
      <h2 style={{marginTop:"25px",color:"#FFC93F"}}>Cyberfrat</h2>
       </div>
      </div>
  )
}

export default CulsightPageLoader;
