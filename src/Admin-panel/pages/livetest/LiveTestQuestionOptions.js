import React from 'react';
import { List, Input, Button, Radio, Checkbox, Space, Divider } from 'antd';

const LiveTestQuestionOptions = (props) => {
  const { options, setOptions, optionChoice } = props;

  const addOption = () => {
    setOptions([...options, { label: '', value: false }]);
  }; 

  const removeOption = (indexToRemove) => {
    if (options.length === 1) return;
    const updated = options.filter((_, i) => i !== indexToRemove);
    setOptions(updated);
  };

  const handleInputChange = (index, e) => {
    const updated = [...options];
    updated[index].label = e.target.value;
    setOptions(updated);
  };

  const handleRadioSelect = (index) => {
    const updated = options.map((option, i) => ({
      ...option,
      value: i === index,
    }));
    setOptions(updated);
  };

  const handleCheckboxToggle = (index) => {
    const updated = [...options];
    updated[index].value = !updated[index].value;
    setOptions(updated);
  };

  const renderOptionItem = (item, index) => (
    <List.Item
      actions={[
        options.length > 1 && (
          <Button danger size="small" onClick={() => removeOption(index)}>
            Remove
          </Button>
        ),
      ]}
    >
      <Space>
        {optionChoice === 'single_choice' ? (
          <Radio value={index} />
        ) : (
          <Checkbox
            checked={item.value}
            onChange={() => handleCheckboxToggle(index)}
          />
        )}
        <Input
          placeholder="Option label"
          value={item.label}
          onChange={(e) => handleInputChange(index, e)}
        />
      </Space>
    </List.Item>
  );

  const selectedIndex = options.findIndex((option) => option.value === true);

  return (
    <div>
      <div style={{ minHeight: '60px', position: 'relative' }}>
        <Divider orientation="left">Option List</Divider>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <Button type="primary" size="small" onClick={addOption}>
            Add Option
          </Button>
        </div>
      </div>

      {optionChoice === 'single_choice' ? (
        <Radio.Group
          style={{width:"100%"}}
          value={selectedIndex}
          onChange={(e) => handleRadioSelect(e.target.value)}
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

export default LiveTestQuestionOptions;
