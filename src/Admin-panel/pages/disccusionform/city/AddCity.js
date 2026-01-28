import React, { useState } from 'react';
import { App, Button, message, Select } from 'antd';
import { ADD_CITY } from '../../../apis/apis';
import { useNavigate } from 'react-router-dom';

const AddCity = (props) => {
    const navigate = useNavigate(); 
    const {notification} = App.useApp()
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

      const onFinish = async () => {
        setLoading(true);
        const FORM_DATA = new FormData();
        FORM_DATA.append("title", city);
        
        try {
          const response = await ADD_CITY(FORM_DATA);
    
          if (response?.data?.status) {
            notification.success({
              message: "Successful",
              description: response?.data?.message,
            });
            setLoading(false);
                    props.set_list_refresh(prev => prev + 1);

        // Close edit view
        props.set_add_city(null);

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
        <div style={{marginTop:"10px"}}>
            <Select
                style={{ width: "100%" }}
                placeholder="Select a city"
                value={city}
                onChange={(value) => setCity(value)}
                options={cities.map((c) => ({
                    value: c,
                }))}
            />

            {errors?.city && (
                <span style={{ color: "red" }}>{errors.city}</span>
            )}

            <br />

            <Button
                style={{ marginTop: "15px" }}
                type="primary"
                loading={loading}
                onClick={onFinish}
            >
                Submit
            </Button>
        </div>
    );
};

export default AddCity;
