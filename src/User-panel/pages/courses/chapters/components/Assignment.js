
import {
  Button,
  Col,
  Modal,
  Row,
} from "antd";
import { useEffect, useState } from "react";

import CulsightPageLoader from "../../../../components/CulsightPageLoader";
import { VIEW_ASSIGNMENT } from "../../../../apis/apis"

export default function Assignment({ course_id, chapter_id }) {
  const [loading, setLoading] = useState(false);

  const [assignment_data, set_assignment_data] = useState("")
const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const VIEW_API = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(chapter_id));


      const response = await VIEW_ASSIGNMENT(FORM_DATA);

      if (response?.data?.status) {
        const data = response.data.data;

        set_assignment_data(data);
      }
      setLoading(false);
    };

    if (chapter_id) {
      VIEW_API();
    }
  }, [chapter_id]);

  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div style={{ marginTop: "15px" }}>
      {loading ? <>
        <CulsightPageLoader />
      </> : <>
        {assignment_data ? <Row>
          <Col span={24}>

            <div className="section-details section-details-right-padding">
              <h2>
                {assignment_data.title}
              </h2>

              <p>
                <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                  Assignment Introduction:
                </span>

                <div dangerouslySetInnerHTML={{ __html: assignment_data.instructions }} />
              </p>

              <p>
                <span style={{ color: "#6ca9ff", fontWeight: "bold" }}>
                  Availablity :-
                </span>
                {" "}
                {assignment_data.availability_settings}
              </p>

              <Button type="primary" style={{ float: "right" }} onClick={showModal}>Upload Assignment</Button>
           
      <Modal
        title="Coming Soon"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
         <p>Development team is working on it and we need to disscuss on it.</p>
      </Modal>
            </div>
          </Col>
        </Row> : <>
          <h3 style={{ padding: "50px", textAlign: "center", color: "red" }}>Data Empty</h3>

        </>}

      </>}

    </div>
  );
}
