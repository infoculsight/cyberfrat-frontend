import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import DOMPurify from "dompurify";

export default function HtmlEditorWithPreview(props) {
  const {setHtmlCode, htmlCode, description} =props

  return (
    <div style={{marginBottom:"30px"}}>
      <label>{description}</label>

      {/* Code Editor */}
      <CodeMirror
        value={htmlCode}
        height="200px"
        extensions={[html()]}
        theme="dark"
        onChange={(value) => setHtmlCode(value)}
      />

      {/* Preview */}
      <div style={{ marginTop: "20px",backgroundColor:"#fff", color:"#000", padding:"20px" }}>
        <h2 style={{borderBottom:"1px solid #ccc",marginBottom: "20px",}}>Live Preview</h2>

        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(htmlCode),
          }}
        />
      </div>
    </div>
  );
}
