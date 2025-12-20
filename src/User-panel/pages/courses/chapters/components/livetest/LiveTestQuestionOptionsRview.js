import { List, Radio, Checkbox, Space, Typography, Grid } from 'antd';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const LiveTestQuestionOptionsRview = (props) => {
  const { options, optionChoice } = props;
  const screens = useBreakpoint();

  const selectedIndex = options.findIndex((option) => option.value === true);

  const renderOptionItem = (item, index) => (
    <List.Item
      style={{
        padding: screens.xs ? "10px 12px" : "12px 16px",
        display: "flex",
        alignItems: "flex-start",
        whiteSpace: "normal",
        wordBreak: "break-word",
        lineHeight: "20px",
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
        {optionChoice === "single_choice" ? (
          <Radio value={index} />
        ) : (
          <Checkbox checked={item.value} />
        )}

        <Text
          style={{
            fontSize: screens.xs ? "14px" : "16px",
            wordWrap: "break-word",
            flex: 1,
          }}
        >
          {item.label}
        </Text>
      </Space>
    </List.Item>
  );

  return (
    <div
      style={{
        width: "100%",
        padding: screens.xs ? "8px" : "0px",
      }}
    >
      {optionChoice === "single_choice" ? (
        <Radio.Group
          style={{ width: "100%" }}
          value={selectedIndex}
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

export default LiveTestQuestionOptionsRview;
