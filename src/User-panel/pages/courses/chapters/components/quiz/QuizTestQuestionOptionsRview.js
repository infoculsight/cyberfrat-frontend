// QuizTestQuestionOptions.jsx
import React, { useEffect } from 'react';
import { List, Radio, Checkbox, Space, Typography } from 'antd';
import { ADD_QUIZ_ANSWER } from '../../../../../apis/apis';

const { Text } = Typography;

const QuizTestQuestionOptionsRview = (props) => {
  const { options, setOptions, optionChoice, chapter_id, question_id } = props;

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
    <List.Item>
      <Space>
        {optionChoice === 'single_choice' ? (
          <Radio value={index} />
        ) : (
          <Checkbox
            checked={item.value}
            onChange={() => handleCheckboxToggle(index)}
          />
        )}
        <Text>{item.label}</Text>
      </Space>
    </List.Item>
  );

  const selectedIndex = options.findIndex((option) => option.value === true);

  const handleAnswerSubmit = async (option_details) => {
    // Only send label and value (remove selected or other fields)
    const cleaned = option_details.map((opt) => ({
      label: opt.label,
      value: !!opt.value,
    }));

    const formattedAnswer = JSON.stringify(cleaned);
    const FORM = new FormData();
    FORM.append("chapter_id", chapter_id);
    FORM.append("question_id", question_id);
    FORM.append("option_details", formattedAnswer);
    try {
      const API_RESPONSE = await ADD_QUIZ_ANSWER(FORM);
      if (API_RESPONSE?.data?.status) {
        props.onAnswerSubmitted();
      }
    } catch (error) {
      console.error("Answer submit failed:", error);
    }
  };

  return (
    <div>
      {optionChoice === 'single_choice' ? (
        <Radio.Group
          style={{ width: "100%" }}
          value={selectedIndex}
        //   onChange={(e) => handleRadioSelect(e.target.value)}
        >
          <List
            bordered
            dataSource={options}
            renderItem={(item, index) => renderOptionItem(item, index)}
          />
        </Radio.Group>
      ) : (
        <List
          bordered
          dataSource={options}
          renderItem={(item, index) => renderOptionItem(item, index)}
        />
      )}
    </div>
  );
};

export default QuizTestQuestionOptionsRview;
