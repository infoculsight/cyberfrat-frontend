import React, { useRef, useState, useEffect } from "react";
import { Card, Typography, Button, Space, Tooltip } from "antd";
import {
  BoldOutlined,
  UnorderedListOutlined,
  SwapOutlined,
  LinkOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const CustomRichTextEditor = ({ value, onChange, editorLabel }) => {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);
  const [isRTL, setIsRTL] = useState(false);

  let lastHtml = "";
  const handleInput = () => {
    const currentHtml = editorRef.current.innerHTML;
    if (currentHtml !== lastHtml) {
      lastHtml = currentHtml;
      if (onChange) onChange(currentHtml);
    }
  };

  // Cursor set karne wala function (last pe)
  const setCursorToEnd = () => {
    const el = editorRef.current;
    if (!el) return;

    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (onChange) onChange(editorRef.current.innerHTML);
    setTimeout(setCursorToEnd, 0);
  };


  // //copy text se html hatave k liye 
  const sanitizePaste = (e) => {
    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;
    const html = clipboardData.getData("text/html");
    const plainText = clipboardData.getData("text/plain");

    if (html) {
      const div = document.createElement("div");
      div.innerHTML = html;

      // // Remove background-color, styles, and classes
      const allElements = div.querySelectorAll("*");
      allElements.forEach((el) => {
        el.removeAttribute("style"); // remove inline styles
        el.removeAttribute("class"); // remove class names
        el.style.backgroundColor = ""; // just in case
      });

 

      // Remove empty <p> tags and unnecessary <br> tags at the beginning
      while (
        div.firstChild &&
        (div.firstChild.nodeName === "BR" ||
          (div.firstChild.nodeName === "P" && div.firstChild.innerText.trim() === ""))
      ) {
        div.removeChild(div.firstChild);
      }


      // Insert cleaned HTML
    //   document.execCommand("insertHTML", false, div.innerHTML);
    // } else {
    //   // fallback to plain text
    //   document.execCommand("insertText", false, plainText);
    // }
       document.execCommand("insertText", false, div.innerText.trim());
  } else {
    // fallback to plain text
    document.execCommand("insertText", false, plainText);
  }

    if (onChange) {
      setTimeout(() => {
        onChange(editorRef.current.innerHTML);
      }, 0);
    }
  };

//   const sanitizePaste = (e) => {
//   e.preventDefault();

//   const clipboardData = e.clipboardData || window.clipboardData;
//   const html = clipboardData.getData("text/html");
//   const plainText = clipboardData.getData("text/plain");

//   if (html) {
//     const div = document.createElement("div");
//     div.innerHTML = html;

//     // Remove unwanted tags, styles, and empty space
//     const cleanNode = (node) => {
//       if (node.nodeType === Node.ELEMENT_NODE) {
//         node.removeAttribute("style");
//         node.removeAttribute("class");
//         node.style.backgroundColor = "";
//         Array.from(node.childNodes).forEach(cleanNode);
//       }
//     };

//     cleanNode(div);

//     // Remove leading <br>, empty <p>, or text nodes
//     while (
//       div.firstChild &&
//       (div.firstChild.nodeName === "BR" ||
//         (div.firstChild.nodeName === "P" && div.firstChild.innerText.trim() === "") ||
//         (div.firstChild.nodeType === Node.TEXT_NODE && div.firstChild.textContent.trim() === ""))
//     ) {
//       div.removeChild(div.firstChild);
//     }

//     // 🔥 Paste as plain text (this line)
//     document.execCommand("insertText", false, div.innerText.trim());
//   } else {
//     // fallback to plain text
//     document.execCommand("insertText", false, plainText);
//   }

//   if (onChange) {
//     setTimeout(() => {
//       onChange(editorRef.current.innerHTML);
//     }, 0);
//   }
// };

  // Jab value update ho to editor content update karo aur cursor last pe set karo
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      setCursorToEnd();
    }
  }, [value]);

  // Toggle direction RTL/LTR
  const toggleDirection = () => {
    setIsRTL((prev) => !prev);
  };

  // Color picker open karna
  const openColorPicker = () => {
    colorInputRef.current.click();
  };

  // Color select hone par command chalana
  const onColorChange = (e) => {
    execCommand("foreColor", e.target.value);
  };

  // Link lagane ke liye prompt
  const addLink = () => {
    const url = window.prompt("Enter the link URL:", "https://");
    if (url && url !== "" && url !== "https://") {
      execCommand("createLink", url);
    }
  };

  return (
    <Card
      title={<Title level={5}>{editorLabel}</Title>}
      style={{
        //marginBottom: "30px",
        borderRadius: 12,
      }}
    >
      <Space style={{ marginBottom: 12 }}>
        <Tooltip title="Bold">
          <Button icon={<BoldOutlined />} onClick={() => execCommand("bold")} />
        </Tooltip>

        <Tooltip title="Bullet List">
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => execCommand("insertUnorderedList")}
          />
        </Tooltip>

        <Tooltip title={isRTL ? "Switch to LTR" : "Switch to RTL"}>
          <Button icon={<SwapOutlined />} onClick={toggleDirection} />
        </Tooltip>

        <Tooltip title="Text Color">
          <Button icon={<BgColorsOutlined />} onClick={openColorPicker} />
          {/* Hidden native color input */}
          <input
            type="color"
            ref={colorInputRef}
            style={{ display: "none" }}
            onChange={onColorChange}
          />
        </Tooltip>

        <Tooltip title="Insert Link">
          <Button icon={<LinkOutlined />} onClick={addLink} />
        </Tooltip>
      </Space>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        // onInput={() => onChange && onChange(editorRef.current.innerHTML)}
        onInput={handleInput}
        onPaste={sanitizePaste}
        style={{
          minHeight: 200,
          border: "1px solid gray",
          padding: 12,
          maxHeight:300,
          overflow:"auto",
          borderRadius: 8,
          outline: "none",
          fontSize: 16,
          direction: isRTL ? "rtl" : "ltr",
          textAlign: isRTL ? "right" : "left",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      />
    </Card>
  );
};

export default CustomRichTextEditor;
