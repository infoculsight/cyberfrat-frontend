import React, { useRef, useState, useEffect } from "react";
import { Card, Typography, Button, Space, Tooltip, Input } from "antd";
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
        
        marginBottom: "30px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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
        onInput={() => onChange && onChange(editorRef.current.innerHTML)}
        style={{
          minHeight: 200,
          border: "1px solid #d9d9d9",
          padding: 12,
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
