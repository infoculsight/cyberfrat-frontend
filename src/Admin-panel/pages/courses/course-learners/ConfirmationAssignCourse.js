import React, { useEffect, useState } from "react";
import { Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

function ConfirmationAssignCourse(props) {
  const { first_name, last_name, onAccessDetailsChange,errors } = props;

  const [access_type, set_access_type] = useState("LifeTime");
  const [expiry_date, set_expiry_date] = useState("");
  const [max_hours, set_max_hours] = useState("");

  useEffect(() => {
    const payload = {
      access_type: access_type,
      expiry_date:
        access_type === "FixedDate" && expiry_date
          ? dayjs(expiry_date).format("YYYY-MM-DD")
          : '',
      max_viewing_hours: access_type === "MaxViewingHours" ? max_hours : '',
    };

    if (onAccessDetailsChange) {
      onAccessDetailsChange(payload);
    }
  }, [access_type, expiry_date, max_hours, onAccessDetailsChange]);

  return (
    <div>
      <p>
        Do you really want to assign{" "}
        <strong>
          {first_name} {last_name}
        </strong>{" "}
        to this course?
      </p>

      <div style={{ marginTop: 16 }}>
        <Select
          value={access_type}
          style={{ width: 200 }}
          onChange={(value) => {
            set_access_type(value);
            set_expiry_date('');
            set_max_hours('');
          }}
          options={[
            { value: "LifeTime", label: "LifeTime" },
            { value: "FixedDate", label: "Fixed Date" },
            { value: "MaxViewingHours", label: "Max Viewing Hours" },
          ]}
        />{errors?.access_type && (
                <span style={{ color: "red" }}>{errors.access_type}</span>
              )}
      </div>

      <div style={{ marginTop: 16 }}>
        {access_type === "FixedDate" && (
          <DatePicker
            style={{ width: 200 }}
            placeholder="Select expiry date"
            value={expiry_date}
            onChange={(date) => set_expiry_date(date)}
          />
        )} {errors?.expiry_date && (
                <span style={{ color: "red" }}>{errors.expiry_date}</span>
              )}

        {access_type === "MaxViewingHours" && (
          <InputNumber
            min={1}
            max={24}
            style={{ width: 200 }}
            placeholder="Enter max hours"
            value={max_hours}
            onChange={(value) => set_max_hours(value)}
          />
        )}{errors?.max_hours && (
                <span style={{ color: "red" }}>{errors.max_hours}</span>
              )}
      </div>
    </div>
  );
}

export default ConfirmationAssignCourse;
