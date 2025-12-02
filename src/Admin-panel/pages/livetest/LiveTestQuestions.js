import { useCallback, useEffect, useState } from 'react';
import { Collapse, Button, Divider, message, Popconfirm, Card, Select, Row, Col, Input, Pagination } from 'antd';
import { LeftOutlined } from "@ant-design/icons";
import {
  LIST_LIVE_TEST_QUESTION,
  DELETE_LIVE_TEST_QUESTION
} from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';
import LiveTestQuestionAddView from "./LiveTestQuestionAddView"
import LiveTestQuestionEditView from "./LiveTestQuestionEditView"
import { useNavigate, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';


const { Panel } = Collapse;

const LiveTestQuestion = (props) => {
  const { Option } = Select;
  const { live_test_id } = useParams()
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page_loader, set_page_loader] = useState(true);
  const [activePanelKey, setActivePanelKey] = useState(null);
  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_questions,set_total_questions] = useState("")
  const showModal = () => setAddQuestionModal(true);
  const handleCancel = () => setAddQuestionModal(false);



  const refetchData = async (expandLatest = false) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("live_test_id", atob(live_test_id));
    const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
    if (LIST_API_RESPONSE?.data?.status) {
      const response_data = LIST_API_RESPONSE?.data?.data;
      set_current_page(LIST_API_RESPONSE?.data?.current_page || 1);
      set_total_pages(LIST_API_RESPONSE?.data?.total_pages || 0);
      set_total_questions(LIST_API_RESPONSE?.data?.total_questions || 0)
      setItems(response_data);
      if (expandLatest && response_data.length > 0) {
        setActivePanelKey(response_data[response_data.length - 1]?.id);
      }
      set_page_loader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("live_test_id", atob(live_test_id));
      const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
      if (LIST_API_RESPONSE?.data?.status) {
        const response_data = LIST_API_RESPONSE?.data?.data;
        set_current_page(LIST_API_RESPONSE?.data?.current_page || 1);
        set_total_pages(LIST_API_RESPONSE?.data?.total_pages || 0);
        set_total_questions(LIST_API_RESPONSE?.data?.total_questions || 0)

        setItems(response_data);
        if (response_data.length > 0) {
          setActivePanelKey(response_data[response_data.length - 1]?.id);
        }
        set_page_loader(false);
      }
    };

    fetchData();
  }, [live_test_id]);

  const confirmDelete = (id) => {
    setQuestionToDelete(id);

  };

  const handleDeleteConfirmed = async () => {
    try {
      const FORM_DATA = new FormData();
      FORM_DATA.append("id", questionToDelete);
      const DELETE_RESPONSE = await DELETE_LIVE_TEST_QUESTION(FORM_DATA);
      if (DELETE_RESPONSE?.data?.status) {
        message.success("Question deleted successfully.");
        setItems(prev => prev.filter(item => item.id !== questionToDelete));
        if (activePanelKey === questionToDelete) {
          setActivePanelKey(null);
        }
      } else {
        message.error("Failed to delete the question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      message.error("Something went wrong while deleting.");
    } finally {
      setQuestionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setQuestionToDelete(null);
  };

  const handleQuestionAdded = (newQuestion) => {
    setAddQuestionModal(false);
    if (newQuestion?.id) {
      setItems(prev => [...prev, newQuestion]);
      setActivePanelKey(newQuestion.id);
    } else {
      refetchData(true);
    }
  };


  const pagination_on_change = async (data) => {
    set_page_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("live_test_id", atob(live_test_id));
    const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
    if (LIST_API_RESPONSE?.data?.status) {
      const response_data = LIST_API_RESPONSE?.data?.data;
        set_current_page(LIST_API_RESPONSE?.data?.current_page || 1);
        set_total_pages(LIST_API_RESPONSE?.data?.total_pages || 0);
        set_total_questions(LIST_API_RESPONSE?.data?.total_questions || 0)
      setItems(response_data);
      // if (response_data.length > 0) {
      //   setActivePanelKey(response_data[response_data.length - 1]?.id);
      // }
      set_page_loader(false);
    }
  };

  const fetchResults = useCallback(
    (search_key, search_value) => {
      debounce(async () => {
        try {
          const FORM_DATA = new FormData();
          FORM_DATA.append("live_test_id", atob(live_test_id));
          FORM_DATA.append(search_key, search_value);
          const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
          if (LIST_API_RESPONSE?.data?.status) {
            const response_data = LIST_API_RESPONSE?.data?.data;
           set_current_page(LIST_API_RESPONSE?.data?.current_page || 1);
           set_total_pages(LIST_API_RESPONSE?.data?.total_pages || 0);
           set_total_questions(LIST_API_RESPONSE?.data?.total_questions || 0)
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
    [live_test_id]
  );

  const handleInput = (e) => {
    fetchResults("question_title", e.target.value);
  };

  const selectBefore = (
    <Select defaultValue="question_title">
      <Option value="question_title">Topic</Option>
    </Select>
  );


  return (
    <div className='lms-body'>
      <Card>
        {page_loader ? (
          <CulsightPageLoader />
        ) : (
          <>
            <div style={{ minHeight: "60px", display: "block", position: "relative" }}>
              <Divider orientation="left">
                {addQuestionModal ? (
                  <>
                    <LeftOutlined onClick={() => navigate("/live-test")} /> Add Question
                  </>
                ) : (
                  <>
                    <LeftOutlined onClick={() => navigate("/live-test")} /> Question List
                  </>
                )}
              </Divider>
              <div style={{ position: "absolute", right: "0px", top: "0px" }}>
                <Button
                  variant="solid"
                  color="green"
                  size="small"
                  onClick={addQuestionModal ? handleCancel : showModal}
                  style={{ marginBottom: 16 }}
                >
                  {addQuestionModal ? "List Questions" : "Add New Question"}
                </Button>
              </div>
            </div>
            {addQuestionModal ? <LiveTestQuestionAddView
              live_test_id={live_test_id}
              onClose={handleCancel}
              onSuccess={handleQuestionAdded}
            /> : <>
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
              <Collapse onChange={key => setActivePanelKey(key)}>
                {items.map(item => (
                  <Panel
                    header={item?.question_title}
                    key={item?.id}
                    extra={
                      items.length > 1 && (
                        <Popconfirm title="Are you sure you want to delete this question?"
                          onConfirm={handleDeleteConfirmed}
                          onCancel={handleDeleteCancel}
                          okText="Yes, Delete"
                          cancelText="No"
                          okButtonProps={{ danger: true }}>
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
                    <LiveTestQuestionEditView
                      question_details={item}
                      live_test_id={live_test_id}
                    />
                  </Panel>
                ))}
              </Collapse>

              {total_pages > 0 ?<> <Pagination
                style={{ marginTop: "15px", float: "right" }}
                onChange={pagination_on_change}
                current={current_page}
                total={total_questions}
                pageSize={5}
              /></>:<></>}
             
            </>}


          </>
        )}
      </Card>
    </div>
  );
};

export default LiveTestQuestion;
