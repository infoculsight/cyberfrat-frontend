import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, App, message, Checkbox } from 'antd';
import CustomRichTextEditor from '../../../components/CustomTextEditor';
import { ADD_TOPIC, LIST_CITY } from '../../../apis/apis';

function AddTopic(props) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errors, set_errors] = useState({});
    const { notification } = App.useApp();
    const [description, set_description] = useState('');
    const [title, set_title] = useState('');
    const [cities, set_cities] = useState([]); // List of cities from API
    const [selectedCities, set_selectedCities] = useState([]); // Selected city IDs
    const [checkAll, setCheckAll] = useState(false);


    const allCityIds = cities.map(city => city.id);

    const onCheckAllChange = (e) => {
        const checked = e.target.checked;
        setCheckAll(checked);
        set_selectedCities(checked ? allCityIds : []);
    };


    // Fetch cities from API
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await LIST_CITY();
                if (response?.data?.status) {
                    set_cities(response.data.data);
                } else {
                    message.error(response?.data?.message || 'Failed to fetch cities');
                }
            } catch (err) {
                message.error('Server Error: ' + (err?.response?.data?.message || 'Unknown error'));
            }
        };
        fetchCities();
    }, []);

    // Handle checkbox change
    const onCityChange = (checkedValues) => {
        set_selectedCities(checkedValues);
        setCheckAll(checkedValues.length === allCityIds.length);
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('city_json', selectedCities); // Send selected city IDs

            const response = await ADD_TOPIC(formData);
            if (response?.data?.status) {
                notification.success({
                    message: 'Successful',
                    description: response.data.message,
                });
                props.set_list_refresh(prev => prev + 1);

                // Close edit view
                props.set_add_topic(null);
            } else {
                set_errors(response?.data?.errors)
                message.error(response?.data?.message || 'Update failed');
            }
        } catch (err) {
            message.error(
                'Server Error: ' + (err?.response?.data?.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Title"
                >
                    <Input
                        placeholder="Enter topic title"
                        value={title}
                        onChange={(e) => set_title(e.target.value)}
                    />
                    {errors?.title && (
                        <span style={{ color: "red" }}>{errors.title}</span>
                    )}
                </Form.Item>

                <CustomRichTextEditor
                    editorLabel={"Description"}
                    value={description}
                    onChange={(value) => set_description(value)}
                />
                {errors?.description && (
                    <span style={{ color: "red" }}>{errors.description}</span>
                )}

                {/* City Checkboxes */}
                <Form.Item label="Select Cities" style={{ marginTop: "15px" }}>
                    <Checkbox
                        indeterminate={
                            selectedCities.length > 0 &&
                            selectedCities.length < allCityIds.length
                        }
                        onChange={onCheckAllChange}
                        checked={checkAll}
                    >
                        Select All
                    </Checkbox>

                    <Checkbox.Group
                        style={{ display: "block", marginTop: "10px" }}
                        options={cities.map(city => ({
                            label: city.title,
                            value: city.id
                        }))}
                        value={selectedCities}
                        onChange={onCityChange}
                    />
                </Form.Item>


                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ float: 'right', marginTop: '20px' }}
                        loading={loading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default AddTopic;
