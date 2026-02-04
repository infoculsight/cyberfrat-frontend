import React, { useEffect, useState, useCallback } from "react";
import { Table, Checkbox, Input, Row, Col, Spin, Pagination, Button, Upload, message, App } from "antd";
import { BULK_ASSIGN_MULTI_PACKAGE, LIST_PACKAGE } from "../../apis/apis";
import debounce from "lodash.debounce";
 
function BulkAssignMultiPackage({ selectedPackages, handleSelect, onCancel, resetTrigger }) {
  const { notification } = App.useApp();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPackages, setTotalPackages] = useState(0);
  const [errors, set_errors] = useState("");
  const [file, set_file] = useState([]);
 
 
  const beforeUpload = (file) => {
    const isCSV = file.type === 'text/csv';
    if (!isCSV) {
      set_errors({ file: "Only CSV files are allowed!" });
      message.error("Please upload a valid CSV file.");
      return Upload.LIST_IGNORE;
    }
 
    set_file([file]);
    set_errors("");
    message.success(` ${file.name}`);
    return false;
  };
 
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
 
 
  useEffect(() => {
    fetchPackages(1, "");
  }, []);
 
  useEffect(() => {
    set_file([]);
    set_errors("");
  }, [resetTrigger]);
 
 
 
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
      title: (
        <Checkbox
          checked={packages.length > 0 && selectedPackages.length === packages.length}
          indeterminate={
            selectedPackages.length > 0 &&
            selectedPackages.length < packages.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              // Select All IDs
              const allIds = packages.map((p) => p.id);
              handleSelect(allIds, true);
            } else {
              // Unselect All
              handleSelect([], true);
            }
          }}
        />
      ),
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
 
 
  const handleSubmit = async () => {
    if (!file?.length) {
      message.error("Please upload a CSV file.");
      return;
    }
 
    if (!selectedPackages.length) {
      message.error("Please select at least one package.");
      return;
    }
 
    const form = new FormData();
    form.append("package_id", selectedPackages.join(","));
    form.append("file", file[0]);
 
    try {
      const res = await BULK_ASSIGN_MULTI_PACKAGE(form);
 
      if (res?.data?.status) {
       notification.success({
          message: "Successful",
          description: res.data.message,
        });
        onCancel();
        set_file([])
 
      } else {
        message.error(res?.data?.message);
      }
    } catch (err) {
 
      message.error("API request failed!");
    }
  };
 
 
 
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
      <Row justify="end" gutter={10} style={{ marginTop: 25 }}>
        <Col>
          <Upload
            beforeUpload={beforeUpload}
            fileList={file}
            onRemove={() => set_file([])}
            accept=".csv"
            maxCount={1}
          >
            <Button type="primary">Upload Learners</Button>
          </Upload>    {errors?.file ? (
            <>
              <span style={{ color: "red" }}>
                {errors?.file}
              </span>
            </>
          ) : (
            <></>
          )}
        </Col>
 
        <Col>
          <Button variant="solid" color="green" onClick={handleSubmit} disabled={file.length === 0}>  
            Submit
          </Button>
        </Col>
      </Row>
 
    </div>
  );
}
 
export default BulkAssignMultiPackage;
 
 