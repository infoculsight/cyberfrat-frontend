import { Card, Col, Input, Pagination, Row, Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import PackageBox from "../../components/PackageBox";
import { LIST_PACKAGE } from "../../apis/apis";
import debounce from "lodash.debounce";
import { LoadingOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader";

function Packages() {
  const [packages, set_packages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination_loader, set_pagination_loader] = useState(false);
  const [current_page, set_current_page] = useState(1);
  const [total_pages, set_total_pages] = useState("");
  const [total_packages, set_total_packages] = useState(0);
  const [search_query_name, set_search_query_name] = useState("");



  const LIST_API = async () => {
    const FORM_DATA = new FormData();
    const API_CALL = await LIST_PACKAGE(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_packages(API_CALL.data?.data);
      set_total_packages(API_CALL.data?.total_packages);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      setLoading(false);
    } else {
      console.log("error");
      setLoading(false);
    }
  };

  useEffect(() => {
    LIST_API();
  }, []);

  const pagination_on_change = async (data) => {
    set_pagination_loader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", data);
    FORM_DATA.append("token", localStorage.getItem("token"));
    FORM_DATA.append("name", search_query_name);
    const API_CALL = await LIST_PACKAGE(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_packages(API_CALL.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_packages(API_CALL?.data?.total_courses);
    }
    set_pagination_loader(false);
  };

  const fetchResultsname = useCallback((value) => {
    debounce(async () => {
      try {
        set_search_query_name(value);
        set_pagination_loader(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("token", localStorage.getItem("token"));
        FORM_DATA.append("name", value);
        const API_CALL = await LIST_PACKAGE(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_packages(API_CALL.data?.data);
          set_current_page(API_CALL?.data?.current_page);
          set_total_pages(API_CALL?.data?.total_pages);
          set_total_packages(API_CALL.data?.total_packages);
        }
        set_pagination_loader(false);
      } catch (err) {
        console.error("API Error:", err);
      }
    }, 500)();
  }, []);

  const handleInput = (e) => {
    const value = e.target.value;
    fetchResultsname(value);
  };

  return (
    <div className="lms-body">
      <Card>
        <h2>Packages</h2>

        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={18} lg={20}>
            <Input
              addonBefore={<span>Name</span>}
              placeholder="Search by name"
              onChange={handleInput}
              size="large"
              style={{ width: "100%" }}
            />
          </Col>
        </Row>

        {loading ? (
          <CulsightPageLoader />
        ) : (
          <>
            {pagination_loader ? (
              <>
                <div style={{ textAlign: "center", padding: "60px" }}>
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
              </>
            ) : (
              <>
                <div className="courses-card" style={{ marginTop: "20px" }}>
                  <Row gutter={[20, 30]}>
                    {packages?.length > 0 ? (
                      packages?.map((items) => (
                        <Col key={items?.id} lg={8} md={8} sm={12} xs={24}>
                          <PackageBox
                            id={btoa(items?.id)}
                            package_name={items?.name}
                            package_image={items?.thumbnail}
                            package_tag_line={items?.tag_line}
                          />
                        </Col>
                      ))
                    ) : (
                      <Col lg={24} md={24} sm={24} xs={24}>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "20px",
                            color: "red",
                            marginTop: "15px",
                          }}
                        >
                          No Result
                        </p>
                      </Col>
                    )}
                  </Row>
                </div>
              </>
            )}

            <div style={{ float: "right", marginTop: "20px" }}>
              {total_pages > 0 && (
                <Pagination
                  current={current_page}
                  total={total_packages}
                  pageSize={10}
                  onChange={pagination_on_change}
                />
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Packages;
