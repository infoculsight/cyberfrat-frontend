import React, { useEffect, useState, useCallback } from "react";
import { Table, Checkbox, Input, Row, Col, Spin, Pagination, Button, Upload, message, App, Card, InputNumber, DatePicker, Select } from "antd";
import { BULK_ASSIGN_MULTI_PACKAGE, LIST_PACKAGE } from "../../apis/apis";
import debounce from "lodash.debounce";
import dayjs from 'dayjs';


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
  const [access_type, set_access_type] = useState('LifeTime');
  const [access_value, set_access_value] = useState('');


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

    if ((access_type === 'FixedDate' || access_type === 'MaxViewingHours') && !access_value) {
      message.error('Please enter access value.');
      return;
    }
    const form = new FormData();
    form.append("package_id", selectedPackages.join(","));
    form.append("file", file[0]);
    form.append('access_type', access_type);

    // Only append access_value if access_type is not LifeTime
    if (access_type === 'FixedDate' || access_type === 'MaxViewingHours') {
      form.append('access_value', access_value);
    }

    try {
      const res = await BULK_ASSIGN_MULTI_PACKAGE(form);

      if (res?.data?.status) {
        notification.success({
          message: "Successful",
          description: res.data.message,
        });
        onCancel();
        set_file([])
        set_access_type('LifeTime');
        set_access_value('');

      } else {
        message.error(res?.data?.message);
      }
    } catch (err) {

      message.error("API request failed!");
    }
  };


  const renderAccessValueInput = () => {
    if (access_type === 'FixedDate') {
      return (
        <>
          <label><b>Access Value:</b></label>
          <DatePicker
            style={{ width: "100%", marginTop: 6 }}
            onChange={(date) =>
              set_access_value(date ? dayjs(date).format('YYYY-MM-DD') : '')
            }
          />
        </>
      );
    }

    if (access_type === 'MaxViewingHours') {
      return (
        <>
          <label><b>Access Value:</b></label>
          <InputNumber
            min={1}
            max={24}
            style={{ width: "100%", marginTop: 6 }}
            placeholder="Enter max hours"
            value={access_value}
            onChange={(value) => set_access_value(value)}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div>
      {/* Top Controls */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={24} align="middle">
          <Col span={10}>
            <label><b>Search Package</b></label>
            <Input
              addonBefore={"Name"}
              placeholder="Search by package name"
              onChange={onSearchInput}
              size="large"
              style={{ marginTop: 6 }}
            />
          </Col>

          <Col span={7}>
            <label><b>Access Type</b></label>
            <Select
              style={{ width: "100%", marginTop: 6 }}
              value={access_type}
              onChange={(value) => {
                set_access_type(value);
                set_access_value('');
              }}
              options={[
                { value: 'LifeTime', label: 'LifeTime' },
                { value: 'FixedDate', label: 'Fixed Date' },
                { value: 'MaxViewingHours', label: 'Max Viewing Hours' },
              ]}
            />
          </Col>

          <Col span={7}>
            {renderAccessValueInput()}
          </Col>
        </Row>


        {/* Table Section */}

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              style={{ marginTop: "20px" }}
              columns={columns}
              dataSource={packages}
              rowKey="id"
              pagination={false}
              loading={paginationLoading}
              bordered
            />

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


        {/* Action Bar */}

        <Row justify="space-between" align="middle" style={{ marginTop: "15px" }}>
          <Col>
            <Upload
              beforeUpload={beforeUpload}
              fileList={file}
              onRemove={() => set_file([])}
              accept=".csv"
              maxCount={1}
            >
              <Button type="primary">
                Upload Learners (CSV)
              </Button>
            </Upload>

            {errors?.file && (
              <div style={{ color: "red", marginTop: 5 }}>
                {errors.file}
              </div>
            )}
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              disabled={file.length === 0}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );

}

export default BulkAssignMultiPackage;

