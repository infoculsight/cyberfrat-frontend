import React from 'react';
import { Checkbox, Row, Col, Card, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function ImportLearners() {


  const props = {
    name: 'file',
    accept: '.xls,.xlsx',
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Sirf Excel file (.xls, .xlsx) upload kar sakte hain!');
        return Upload.LIST_IGNORE;
      }
      return true; // allow upload
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file, onSuccess }) => {
      // Aap yahan API ke through upload kar sakte hain
      console.log('Uploading file:', file);
      setTimeout(() => {
        onSuccess("ok");
      }, 1000);
    }
  };

  return (
    <div className='lms-body'>


      <Card>
        <h3>Generate Spreadsheet Template for Adding Data</h3>
        <span>Select columns for your data and download template</span>


        <div style={{ maxWidth: 600, margin: "15px auto" }}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={12}><Checkbox defaultChecked disabled>First Name</Checkbox></Col>
              <Col span={12}><Checkbox>Last Name</Checkbox></Col>
              <Col span={12}><Checkbox>Organization</Checkbox></Col>
              <Col span={12}><Checkbox>Designation</Checkbox></Col>
              <Col span={12}><Checkbox defaultChecked disabled>Email</Checkbox></Col>
              <Col span={12}><Checkbox>Contact Number</Checkbox></Col>
              <Col span={12}><Checkbox>Country Code</Checkbox></Col>
              <Col span={12}><Checkbox>Address 1</Checkbox></Col>
              <Col span={12}><Checkbox>Address 2</Checkbox></Col>
              <Col span={12}><Checkbox>Pin Code</Checkbox></Col>
              <Col span={12}><Checkbox>Password</Checkbox></Col>
              <Col span={12}><Checkbox>Confirm Password</Checkbox></Col>
            </Row>
          </Card>
        </div>
      <Upload {...props}>
      <Button icon={<UploadOutlined />} type='primary'>Upload Excel File</Button>
    </Upload>
      </Card>
    </div>
  );
}

export default ImportLearners;
