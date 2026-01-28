import React, { useEffect, useState } from 'react';
import { App, Button, message, Select } from 'antd';
import { ADD_CITY, EDIT_CITY, VIEW_CITY } from '../../../apis/apis';
import { useNavigate, useParams } from 'react-router-dom';

const EditCity = (props) => {
  const navigate = useNavigate();
  const { id } = useParams()
  const { notification } = App.useApp()
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [errors, set_errors] = useState({});

  const cities = [
    'Mumbai',
    'Delhi',
    'Pune',
    'Jaipur',
    'Kolkata',
    'Kanpur',
    'Bangalore',
    'patna',
    'Chennai',
    'Hyderabad',
  ];

  const VIEW_API = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", props?.id);
    const API_CALL = await VIEW_CITY(FORM_DATA);
    if (API_CALL?.data?.status) {
      setCity(API_CALL?.data?.data?.title);
    }
    setLoading(false);
  };

  useEffect(() => {
    VIEW_API();
  }, [props?.id]);

  const onFinish = async () => {
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("id", props.id);
    FORM_DATA.append("title", city);

    try {
      const response = await EDIT_CITY(FORM_DATA);

      if (response?.data?.status) {
        notification.success({
          message: "Successful",
          description: response?.data?.message,
        });
        setLoading(false);
        props.set_list_refresh(prev => prev + 1);

        // Close edit view
        props.set_edit_city(null);

      } else {
        setLoading(false);
        set_errors(response?.data?.errors);
      }
    } catch (error) {
      message.error(
        "Server Error: " + (error?.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Select
        style={{ width: "100%" }}
        placeholder="Select a city"
        value={city}
        onChange={(value) => setCity(value)}
        options={cities.map((c) => ({
          value: c,
        }))}
      />

      {errors?.title && (
        <span style={{ color: "red" }}>{errors.title}</span>
      )}

      <br />

      <Button
        style={{ marginTop: "15px" }}
        type="primary"
        loading={loading}
        onClick={onFinish}
      >
        Update
      </Button>
    </div>
  );
};

export default EditCity;
