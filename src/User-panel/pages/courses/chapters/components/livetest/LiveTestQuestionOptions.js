// QuizTestQuestionOptions.jsx
import React, { useEffect } from 'react';
import { List, Radio, Checkbox, Space, Typography, Grid } from 'antd';
import { ADD_LIVE_TEST_ANSWERS } from '../../../../../apis/apis';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const LiveTestQuestionOptions = (props) => {
  const { options, setOptions, optionChoice, live_test_id, question_id } = props;
  const screens = useBreakpoint();

  // Clean incoming options: convert 'selected' to 'value'
  useEffect(() => {
    const updated = options.map((opt) => ({
      label: opt.label,
      value: opt.value ?? opt.selected ?? false,
    }));
    setOptions(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRadioSelect = (index) => {
    const updated = options.map((option, i) => ({
      label: option.label,
      value: i === index,
    }));
    setOptions(updated);
    handleAnswerSubmit(updated);
  };

  const handleCheckboxToggle = (index) => {
    const updated = options.map((option, i) => {
      if (i === index) {
        return {
          ...option,
          value: !option.value,
        };
      }
      return option;
    });
    setOptions(updated);
    handleAnswerSubmit(updated);
  };

  const renderOptionItem = (item, index) => (
    <List.Item
      style={{
        padding: screens.xs ? "10px 12px" : "12px 16px",
        display: "flex",
        alignItems: "flex-start",
        wordWrap: "break-word",
        whiteSpace: "normal",
      }}
    >
      <Space
        align="start"
        style={{
          width: "100%",
          display: "flex",
          gap: screens.xs ? "8px" : "12px",
        }}
      >
        {optionChoice === 'single_choice' ? (
          <Radio value={index} />
        ) : (
          <Checkbox
            checked={item.value}
            onChange={() => handleCheckboxToggle(index)}
            style={{ marginTop: "3px" }}
          />
        )}

        <Text
          style={{
            fontSize: screens.xs ? "14px" : "16px",
            lineHeight: "20px",
            wordBreak: "break-word",
            flex: 1,
          }}
        >
          {item.label}
        </Text>
      </Space>
    </List.Item>
  );

  const selectedIndex = options.findIndex((option) => option.value === true);

  const handleAnswerSubmit = async (option_details) => {
    const cleaned = option_details.map((opt) => ({
      label: opt.label,
      value: !!opt.value,
    }));

    const formattedAnswer = JSON.stringify(cleaned);
    const FORM = new FormData();
    FORM.append("live_test_id", live_test_id);
    FORM.append("question_id", question_id);
    FORM.append("option_details", formattedAnswer);

    try {
      const API_RESPONSE = await ADD_LIVE_TEST_ANSWERS(FORM);
      if (API_RESPONSE?.data?.status) {
        props.onAnswerSubmitted();
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  return (
    <div
      style={{
        padding: screens.xs ? "8px" : "0px",
        width: "100%",
      }}
    >
      {optionChoice === 'single_choice' ? (
        <Radio.Group
          style={{ width: "100%" }}
          value={selectedIndex}
          onChange={(e) => handleRadioSelect(e.target.value)}
        >
          <List
            bordered
            dataSource={options}
            renderItem={(item, index) => renderOptionItem(item, index)}
            style={{
              borderRadius: "6px",
              overflow: "hidden",
            }}
          />
        </Radio.Group>
      ) : (
        <List
          bordered
          dataSource={options}
          renderItem={(item, index) => renderOptionItem(item, index)}
          style={{
            borderRadius: "6px",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default LiveTestQuestionOptions;
