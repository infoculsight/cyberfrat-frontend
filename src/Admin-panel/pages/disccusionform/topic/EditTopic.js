import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, App, message, Checkbox } from 'antd';
import CustomRichTextEditor from '../../../components/CustomTextEditor';
import { EDIT_TOPIC, LIST_CITY, VIEW_TOPIC } from '../../../apis/apis';
import CulsightPageLoader from "../../../components/CulsightPageLoader"

function EditTopic(props) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errors, set_errors] = useState({});
    const { notification } = App.useApp();
    const [description, set_description] = useState('');
    const [title, set_title] = useState('');
    const [cities, set_cities] = useState([]); // List of cities from API
    const [selectedCities, set_selectedCities] = useState([]); // Selected city IDs

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


    const VIEW_API = async () => {
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("id", props?.id);
        const API_CALL = await VIEW_TOPIC(FORM_DATA);
        if (API_CALL?.data?.status) {
            set_title(API_CALL?.data?.data?.title);
            set_description(API_CALL?.data?.data?.description);

            const selected = API_CALL?.data?.data?.city_json; // e.g., "1,3,5"
            const selectedArray = selected
                ? selected.split(',').map(id => Number(id))
                : [];
            set_selectedCities(selectedArray);

        }
        setLoading(false);
    };

    useEffect(() => {
        VIEW_API();
    }, [props.id]);

    // Handle checkbox change
    const onCityChange = (checkedValues) => {
        set_selectedCities(checkedValues);
    };

    const onFinish = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('id', props?.id);
            formData.append('description', description);
            formData.append('city_json', selectedCities); // Send selected city IDs

            const response = await EDIT_TOPIC(formData);
            if (response?.data?.status) {
                notification.success({
                    message: 'Successful',
                    description: response.data.message,
                });
                props.set_list_refresh(prev => prev + 1);

                // Close edit view
                props.set_edit_topic(null);
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

        {loading ? <>
<CulsightPageLoader />
        </>
        :<>
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
                    <Checkbox.Group
                        options={cities.map(city => ({ label: city.title, value: city.id }))}
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
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </>}
          
        </>
    );
}

export default EditTopic;
