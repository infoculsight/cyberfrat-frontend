import React, { useState, useEffect } from 'react';
import { Checkbox, Row, Col, Card, Upload, Button, message, Select, Input, DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { BULK_ASSIGN_LIVE_TEST } from '../../apis/apis';

function BulkInrollLearnersToLiveTest({ live_test_id, isModalOpen }) {
    const [access_type, set_access_type] = useState('LifeTime');
    const [access_value, set_access_value] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (isModalOpen) {
            setFile(null);
            set_access_value('');
            set_access_type('LifeTime');
        }
    }, [isModalOpen]);


    const handleFileChange = ({ fileList }) => {
        const selectedFile = fileList[0]?.originFileObj;
        if (!selectedFile) {
            setFile(null);
            return;
        }

        const isExcel =
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            selectedFile.type === 'application/vnd.ms-excel';

        if (!isExcel) {
            message.error('Sirf Excel file (.xls, .xlsx) upload kar sakte hain!');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        message.success(`File selected: ${selectedFile.name}`);
    };

  
    const handleSubmit = async () => {
        if (!file) {
            message.error('Please select an Excel file first.');
            return;
        }

        if ((access_type === 'FixedDate' || access_type === 'MaxViewingHours') && !access_value) {
            message.error('Please enter access value.');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('live_test_id', atob(live_test_id));
            formData.append('access_type', access_type);
            formData.append('access_value', access_value);

            
            const response = await BULK_ASSIGN_LIVE_TEST(formData);
            if (response?.data?.success) {
                message.success('Learners enrolled successfully!');
                setFile(null);
                set_access_value('');
            } else {
                message.error(response?.data?.message || 'Enrollment failed!');
            }
        } catch (error) {
           
            message.error('Server error: Could not enroll learners.');
        } finally {
            setLoading(false);
        }
    };


    const renderAccessValueInput = () => {
        if (access_type === 'FixedDate') {
            return (
                <>
                    <label><b>Access Value (Select Date):</b></label>
                    <DatePicker
                        style={{ width: 300, marginBottom: '20px' }}
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
                    <label><b>Access Value (Enter Hours):</b></label>
                    <Input
                        style={{ width: 300, marginBottom: '20px' }}
                        type="number"
                        placeholder="Enter number of hours"
                        value={access_value}
                        onChange={(e) => set_access_value(e.target.value)}
                    />
                </>
            );
        }

        return null;
    };

    return (
        <div className="lms-body">
            <Card>
                <h3>Bulk Enroll Learners to Live Test</h3>
                <span>Upload Excel file and submit to enroll learners.</span>

                <div style={{ maxWidth: 600, margin: '15px auto' }}>
                    <Card>
                        <label><b>Access Type:</b></label>
                        <Select
                            style={{ width: 300, marginBottom: '20px' }}
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

                        {/* Conditionally show access_value field */}
                        {renderAccessValueInput()}

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Checkbox defaultChecked disabled>Email</Checkbox>
                            </Col>
                        </Row>
                    </Card>
                </div>

                {/* Excel Upload */}
                <Upload
                    beforeUpload={() => false} // Prevent auto upload
                    onChange={handleFileChange}
                    fileList={file ? [{ uid: '-1', name: file.name }] : []}
                    accept=".xls,.xlsx"
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Select Excel File</Button>
                </Upload>

                {/* Submit */}
                <div style={{ marginTop: 20 }}>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!file}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default BulkInrollLearnersToLiveTest;
