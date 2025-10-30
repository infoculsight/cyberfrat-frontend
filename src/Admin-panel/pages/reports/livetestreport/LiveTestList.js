import {
  Button,

  Col,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import { LoadingOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import LiveTestReport from "./LiveTestReport";
import { LIST_LIVE_TESTS } from "../../../apis/apis";
import debounce from "lodash.debounce";
import CulsightPageLoader from "../../../components/CulsightPageLoader";


const { Option } = Select;

function LiveTestList() {
  const [loader, setLoader] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, set_dataSource] = useState([])
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [model_row, set_model_row] = useState(null);
  const [search_query_value, set_search_query_value] = useState('');

  const showModal = (record) => {
    set_model_row(record)
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);

  };


  const columns = [
    {
      title: "Created On",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
  
    {
      title: "Timings",
      dataIndex: "timings",
      render: (text, record) => (
        <>
          <span>Available from: </span>{record?.available_from}<br></br>
          <span>Available till: </span>{record?.available_till}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => showModal(record)}
          >
            <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
          </Button>
        </Space>
      ),
    },
  ];


  const fetchResults = useCallback((search_value) => {
    debounce(async () => {
      try {
        set_pagination_loader(true);
        const FORM_DATA = new FormData();

        FORM_DATA.append('title', search_value);
        const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_dataSource(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        set_pagination_loader(false);
      }
    }, 500)(); 
  }, []);


  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_dataSource(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      setLoader(false);
    } else {
      console.log("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);


  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append('title', search_query_value);
    const API_CALL = await LIST_LIVE_TESTS(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_dataSource(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
    } else {
      set_pagination_loader(false);
    }
  }


  const selectBefore = (
    <Select defaultValue="Title" onChange={(value) => {
      fetchResults(search_query_value)
    }}>
      <Option value="Title">Title</Option>
    </Select>
  );


  const handleInput = (e) => {
    const value = e.target.value;
    set_search_query_value(value)
    fetchResults(value)
  };


  return (
    <div>
      <h2>Live Tests Reports</h2>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={18} lg={20}>
          <Input
            addonBefore={selectBefore}
            placeholder="Search by course title and chapter title"
            onChange={handleInput}
            size="large"
          />
        </Col>
      </Row>

      {loader ? (<>
        <CulsightPageLoader />
      </>) : (<>
        {pagination_loader ? (<>
          <div style={{ textAlign: "center", padding: "60px" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        </>) : (<>

          <Row style={{ marginTop: "15px" }}>
            <Col span={24}>
              <Table dataSource={dataSource} columns={columns} pagination={false} />
              {total_pages > 0 ? (
                <>
                  <div style={{ float: "right", marginTop: "20px" }}>
                    {" "}
                    <Pagination
                      onChange={pagination_on_change}
                      defaultCurrent={current_page}
                      total={total_pages}
                      pageSize={10}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: "center", color: "red" }}>
                    <h2>No Learener Found</h2>
                  </div>
                </>
              )}
            </Col>
          </Row>

        </>)}
      </>)}


      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1100}
      >
        <LiveTestReport model_row={model_row} />
      </Modal>

    </div>
  );
}

export default LiveTestList;
