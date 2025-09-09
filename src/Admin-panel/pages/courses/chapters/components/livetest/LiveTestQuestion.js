import { useEffect, useState } from 'react';
import { Collapse, Button, Divider, message, Popconfirm } from 'antd';
import LiveTestQuestionAddView from './LiveTestQuestionAddView';
import {
  LIST_LIVE_TEST_QUESTION,
  DELETE_LIVE_TEST_QUESTION
} from '../../../../../apis/apis';
import CulsightPageLoader from '../../../../../components/CulsightPageLoader';
import LiveTestQuestionEditView from './LiveTestQuestionEditView';

const { Panel } = Collapse;

const LiveTestQuestion = (props) => {
  const [items, setItems] = useState([]);
  const [page_loader, set_page_loader] = useState(true);
  //const [isModalVisible, setIsModalVisible] = useState(false);
  const [activePanelKey, setActivePanelKey] = useState(null);

  // For Add Question Modal
  const [addQuestionModal, setAddQuestionModal] = useState(false);

  // For Delete Confirmation Modal
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const showModal = () => setAddQuestionModal(true);
  const handleCancel = () => setAddQuestionModal(false);

  const refetchData = async (expandLatest = false) => {
    const FORM_DATA = new FormData();
    FORM_DATA.append("chapter_id", atob(props.chapter_id));
    const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
    if (LIST_API_RESPONSE?.data?.status) {
      const response_data = LIST_API_RESPONSE?.data?.data;
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
      FORM_DATA.append("chapter_id", atob(props.chapter_id));
      const LIST_API_RESPONSE = await LIST_LIVE_TEST_QUESTION(FORM_DATA);
      if (LIST_API_RESPONSE?.data?.status) {
        const response_data = LIST_API_RESPONSE?.data?.data;
        setItems(response_data);
        if (response_data.length > 0) {
          setActivePanelKey(response_data[response_data.length - 1]?.id);
        }
        set_page_loader(false);
      }
    };

    fetchData();
  }, [props.chapter_id]);

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

  return (
    <div>
      {page_loader ? (
        <CulsightPageLoader />
      ) : (
        <>
          <div style={{ minHeight: "60px", display: "block", position: "relative" }}>
            <Divider orientation="left">{addQuestionModal ? 'Add Question' : 'Question List'}</Divider>
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
            chapter_id={props.chapter_id}
            course_id={props.course_id}
            onClose={handleCancel}
            onSuccess={handleQuestionAdded}
          /> : <>
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
                    chapter_id={props.chapter_id}
                    course_id={props.course_id}
                  />
                </Panel>
              ))}
            </Collapse>

          </>}


        </>
      )}
    </div>
  );
};

export default LiveTestQuestion;
