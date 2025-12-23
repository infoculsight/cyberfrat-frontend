import React, { useState, useEffect } from 'react';
import { Card, Upload, Button, message, Select, Input, DatePicker, Typography, App, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { BULK_ASSIGN_COURSE } from '../../../apis/apis';
const { Text } = Typography;

function BulEnrollLearners({ course_id, isModalOpen, onSuccess }) {

    const { notification } = App.useApp();
    const [access_type, set_access_type] = useState('LifeTime');
    const [access_value, set_access_value] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileError, setFileError] = useState('');


    useEffect(() => {
        if (isModalOpen) {
            setFile(null);
            set_access_value('');
            set_access_type('LifeTime');
            setFileError('');
        }
    }, [isModalOpen]);



    useEffect(() => {
        if (isModalOpen) {
            setFile(null);
            set_access_value('');
            set_access_type('LifeTime');
            setFileError('');
        }
    }, [isModalOpen]);


    const handleFileChange = (file) => {
        const isCSV = file.type === 'text/csv';
        if (!isCSV) {

            return Upload.LIST_IGNORE;
        }

        setFile([file]);
        setFileError('');
        message.success(` ${file.name}`);
        return false;
    };


    const handleSubmit = async () => {

        if (!file) {
            setFileError('Please select a CSV file before submitting.');
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
            formData.append('file', file[0]);
            formData.append('course_id', atob(course_id));
            formData.append('access_type', access_type);

            // Only append access_value if access_type is not LifeTime
            if (access_type === 'FixedDate' || access_type === 'MaxViewingHours') {
                formData.append('access_value', access_value);
            }

            const response = await BULK_ASSIGN_COURSE(formData);
            if (response?.data?.status) {
                notification.success({
                    message: "Successful",
                    description: response?.data?.message,
                });
                setFile([]);
                set_access_value('');
                if (onSuccess) onSuccess();

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
                    <InputNumber
                        min={1}
                        max={24}
                        style={{ width: 200 }}
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
                        <br />
                        {/* Conditionally show access_value field */}
                        {renderAccessValueInput()}

                        {/* <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Checkbox defaultChecked disabled>Email</Checkbox>
                            </Col>
                        </Row> */}
                    </Card>
                </div>

                {/* Excel Upload */}
                <Upload
                    beforeUpload={handleFileChange}
                    fileList={file}
                    onRemove={() => setFile([])}
                    accept=".csv"
                    multiple={false}
                    maxCount={1}
                    style={{ width: "100%" }} // optional
                >
                    <Button icon={<UploadOutlined />}>Select Excel File</Button>
                </Upload>
                {fileError && (
                    <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
                        {fileError}
                    </Text>
                )}

                {/* Submit */}
                <div style={{ marginTop: 20 }}>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default BulEnrollLearners;
