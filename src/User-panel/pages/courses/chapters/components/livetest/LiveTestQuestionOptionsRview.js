// QuizTestQuestionOptions.jsx
import React, { useEffect } from 'react';
import { List, Radio, Checkbox, Space, Typography } from 'antd';
import { ADD_LIVE_TEST_ANSWERS } from '../../../../../apis/apis';

const { Text } = Typography;

const LiveTestQuestionOptionsRview = (props) => {
  const { options, setOptions, optionChoice, live_test_id, question_id, option_details } = props;
  
  //
const selectedIndex = options.findIndex((option) => option.value === true);
  const renderOptionItem = (item, index) => (
    <List.Item>
      <Space>
        {optionChoice === 'single_choice' ? (
          <Radio value={index}  />
        ) : (
          <Checkbox
            checked={item.value}
            // onChange={() => handleCheckboxToggle(index)}
          />
        )}
        <Text>{item.label}</Text>
      </Space>
    </List.Item>
  );

  


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

export default LiveTestQuestionOptionsRview;
// QuizTestQuestionOptions.jsx












