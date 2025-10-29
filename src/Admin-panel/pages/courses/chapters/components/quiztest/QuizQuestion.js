import React, { useCallback, useEffect, useState } from "react";
import {
  Collapse,
  Button,
  Divider,
  message,
  Popconfirm,
  Pagination,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import {
  List_QUIZ_QUESTION,
  DELETE_QUIZ_QUESTION,
} from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";

import AddQuizQuestion from "./AddQuizQuestion";
import EditQuizQuestion from "./EditQuizQuestion";
import debounce from "lodash.debounce";

const { Panel } = Collapse;

const QuizQuestion = (props) => {
  const { Option } = Select;
  const [items, setItems] = useState([]);
  const [page_loader, set_page_loader] = useState(true);
  const [activePanelKey, setActivePanelKey] = useState(null);

  const [questionToDelete, setQuestionToDelete] = useState(null);

  // For Add Question View toggle
  const [addQuestionView, setAddQuestionView] = useState(false);

  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");

  const refetchData = async (expandLatest = false) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(props.chapter_id));
    const LIST_API_RESPONSE = await List_QUIZ_QUESTION(FORM_DATA);
    if (LIST_API_RESPONSE?.data?.status) {
      const response_data = LIST_API_RESPONSE?.data?.data;
      setItems(response_data);
      // if (expandLatest && response_data.length > 0) {
      //   setActivePanelKey(response_data[response_data.length - 1]?.id);
      // }
      set_page_loader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(props.chapter_id));
      const LIST_API_RESPONSE = await List_QUIZ_QUESTION(FORM_DATA);
      if (LIST_API_RESPONSE?.data?.status) {
        const response_data = LIST_API_RESPONSE?.data?.data;
        set_current_page(LIST_API_RESPONSE?.data?.current_page);
        set_total_pages(LIST_API_RESPONSE?.data?.total_questions);
        setItems(response_data);
        // if (response_data.length > 0) {
        //   setActivePanelKey(response_data[response_data.length - 1]?.id);
        // }
        set_page_loader(false);
      }
    };

    fetchData();
  }, [props.chapter_id]);

  const pagination_on_change = async (data) => {
    set_page_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("chapter_id", atob(props.chapter_id));
    const LIST_API_RESPONSE = await List_QUIZ_QUESTION(FORM_DATA);
    if (LIST_API_RESPONSE?.data?.status) {
      const response_data = LIST_API_RESPONSE?.data?.data;
      set_current_page(LIST_API_RESPONSE?.data?.current_page);
      set_total_pages(LIST_API_RESPONSE?.data?.total_questions);
      setItems(response_data);
      // if (response_data.length > 0) {
      //   setActivePanelKey(response_data[response_data.length - 1]?.id);
      // }
      set_page_loader(false);
    }
  };

  const confirmDelete = (id) => {
    setQuestionToDelete(id);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", questionToDelete);
      const DELETE_RESPONSE = await DELETE_QUIZ_QUESTION(FORM_DATA);
      if (DELETE_RESPONSE?.data?.status) {
        message.success("Quiz question deleted successfully.");
        setItems((prev) => prev.filter((item) => item.id !== questionToDelete));
        if (activePanelKey === questionToDelete) {
          setActivePanelKey(null);
        }
      } else {
        message.error("Failed to delete the quiz question.");
      }
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      message.error("Something went wrong while deleting.");
    } finally {
      setQuestionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setQuestionToDelete(null);
  };

  const handleQuestionAdded = (newQuestion) => {
    setAddQuestionView(false);
    if (newQuestion?.id) {
      setItems((prev) => [...prev, newQuestion]);
      setActivePanelKey(newQuestion.id);
    } else {
      refetchData(true);
    }
  };

  const fetchResults = useCallback(
    (search_key, search_value) => {
      debounce(async () => {
        try {
          const FORM_DATA = new FormData();
          FORM_DATA.append("chapter_id", atob(props.chapter_id));
          FORM_DATA.append(search_key, search_value);
          const LIST_API_RESPONSE = await List_QUIZ_QUESTION(FORM_DATA);
          if (LIST_API_RESPONSE?.data?.status) {
            const response_data = LIST_API_RESPONSE?.data?.data;
            set_current_page(LIST_API_RESPONSE?.data?.current_page);
            set_total_pages(LIST_API_RESPONSE?.data?.total_pages);
            setItems(response_data);
            // if (response_data.length > 0) {
            //   setActivePanelKey(response_data[response_data.length - 1]?.id);
            // }
          }
        } catch (err) {
          console.error("API Error:", err);
        }
      }, 500)(); // Call debounce immediately
    },
    [props.chapter_id]
  );

  const handleInput = (e) => {
    fetchResults("topic", e.target.value);
  };

  const selectBefore = (
    <Select defaultValue="topic">
      <Option value="topic">Topic</Option>
    </Select>
  );

  return (
    <div>
      {page_loader ? (
        <CulsightPageLoader />
      ) : (
        <>
          <div
            style={{
              minHeight: "60px",
              display: "block",
              position: "relative",
            }}
          >
            <Divider orientation="left">
              {addQuestionView ? "Add Question" : "Question List"}
            </Divider>
            <div style={{ position: "absolute", right: "0px", top: "0px" }}>
              <Button
                variant="solid"
                color="green"
                size="small"
                onClick={() => setAddQuestionView(!addQuestionView)}
                style={{ marginBottom: 16 }}
              >
                {addQuestionView ? "List Questions" : "Add New Question"}
              </Button>
            </div>
          </div>

          {addQuestionView ? (
            <AddQuizQuestion
              chapter_id={props.chapter_id}
              course_id={props.course_id}
              onClose={() => setAddQuestionView(false)}
              onSuccess={handleQuestionAdded}
            />
          ) : (
            <>
              <Row style={{ marginBottom: "15px" }}>
                <Col span={12}>
                  <Input
                    addonBefore={selectBefore}
                    onChange={handleInput}
                    placeholder="Search by Topic"
                    size="large"
                  />
                </Col>
              </Row>

              <Collapse
                activeKey={activePanelKey}
                onChange={(key) => setActivePanelKey(key)}
              >
                {items.map((item, index) => (
                  <Panel
                    header={`${current_page}.${index + 1} ${item?.topic}`}
                    key={item?.id}
                    extra={
                      items.length > 1 && (
                        <Popconfirm
                          title="Are you sure you want to delete this question?"
                          onConfirm={handleDeleteConfirmed}
                          onCancel={handleDeleteCancel}
                          okText="Yes, Delete"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            size="small"
                            danger
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(item?.id);
                            }}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      )
                    }
                  >
                    <EditQuizQuestion
                      question_details={item}
                      chapter_id={props.chapter_id}
                      course_id={props.course_id}
                      quiz_question_id={btoa(item.id.toString())}
                    />
                  </Panel>
                ))}
              </Collapse>

              <Pagination
                style={{ marginTop: "15px", float: "right" }}
                onChange={pagination_on_change}
                defaultCurrent={current_page}
                total={total_pages}
                pageSize={5}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuizQuestion;
