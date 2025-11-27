import React, { useEffect, useState, useCallback } from "react";
import { Table, Checkbox, Input, Row, Col, Spin, Pagination, Button } from "antd";
import { LIST_PACKAGE } from "../../apis/apis";
import debounce from "lodash.debounce";

function AssignPackagePage({ selectedPackages, handleSelect }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);

  
  const fetchPackages = async (page = 1, searchText = "") => {
    setPaginationLoading(true);

    const form = new FormData();
    form.append("page", page);
    form.append("name", searchText);
    const res = await LIST_PACKAGE(form);
    if (res?.data?.status) {
      setPackages(res.data.data);
      setTotalPackages(res.data.total_packages);
      setCurrentPage(res.data.current_page);
    }

    setLoading(false);
    setPaginationLoading(false);
  };

  // First Load
  useEffect(() => {
    fetchPackages(1, "");
  }, []);

  // --- Debounced Search ---
  const handleSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      fetchPackages(1, value);
    }, 500),
    []
  );

  const onSearchInput = (e) => {
    handleSearch(e.target.value);
  };

  // Pagination
  const changePage = (page) => {
    fetchPackages(page, search);
  };

  // Table Columns
  const columns = [
    {
      title: "",
      width: 60,
      render: (_, record) => (
        <Checkbox
          checked={selectedPackages.includes(record.id)}
          onChange={() => handleSelect(record.id)}
        />
      ),
    },
    {
      title: "Package Name",
      dataIndex: "name",
    },
    {
      title: "Courses",
      width: 120,
      dataIndex: "course_count",
      render: (val) => <b>{val ?? 0}</b>,
    },
  ];

  return (
    <div>
      {/* Search Box */}
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Input
            addonBefore={<>Name</>}
            placeholder="Search package"
            onChange={onSearchInput}
            size="large"
          />
        </Col>
        <Col span={12}> 
        <Button variant="solid" color="green" size="small" style={{float:"right",marginTop:"10px"}}>
          Add Learners 
        </Button>
        </Col>
      </Row>

      {/* Loader */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={packages}
            rowKey="id"
            pagination={false}
            loading={paginationLoading}
            bordered
          />

          {/* Pagination */}
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Pagination
              current={currentPage}
              total={totalPackages}
              pageSize={9}
              onChange={changePage}
            />
          </div>
        </>
      
      )}
        <Button variant="solid" color="green" style={{float:"right",marginTop:"-30px"}}>Submit</Button>
    </div>
  );
}

export default AssignPackagePage;
