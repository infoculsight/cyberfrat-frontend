import { Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';


function LmsCountryDropdown(props) {
     const [contact_number, set_contact_number] = useState(props.contact);
    const countries = [
        "AW", "AF", "AO", "AI", "AX", "AL", "AD", "AE", "AR", "AM", "AQ", "AG", "AU", "AT", "AZ",
        "BI", "BE", "BJ", "BF", "BD", "BG", "BH", "BS", "BA", "BY", "BZ", "BM", "BO", "BR", "BB",
        "BN", "BT", "BV", "BW", "CF", "CA", "CC", "CH", "CL", "CN", "CI", "CM", "CD", "CG", "CK",
        "CO", "KM", "CV", "CR", "CU", "CW", "CX", "KY", "CY", "CZ", "DE", "DJ", "DM", "DK", "DO",
        "DZ", "EC", "EG", "ER", "EH", "ES", "EE", "ET", "FI", "FJ", "FK", "FR", "FO", "FM", "GA",
        "GB", "GE", "GG", "GH", "GI", "GN", "GP", "GM", "GW", "GQ", "GR", "GD", "GL", "GT", "GF",
        "GU", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IM", "IN", "IO", "IE", "IR", "IQ",
        "IS", "IL", "IT", "JM", "JE", "JO", "JP", "KZ", "KE", "KG", "KH", "KI", "KN", "KR", "XK",
        "KW", "LA", "LB", "LR", "LY", "LC", "LI", "LK", "LS", "LT", "LU", "LV", "MO", "MF", "MA",
        "MC", "MD", "MG", "MV", "MX", "MH", "MK", "ML", "MT", "MM", "ME", "MN", "MP", "MZ", "MR",
        "MS", "MQ", "MU", "MW", "MY", "NA", "NC", "NE", "NF", "NG", "NI", "NU", "NL", "NO", "NP",
        "NR", "NZ", "OM", "PK", "PA", "PN", "PE", "PH", "PW", "PG", "PL", "PR", "PT", "PY", "PS",
        "QA", "RE", "RO", "RU", "RW", "SA", "SD", "SN", "SG", "GS", "SH", "SJ", "SB", "SL", "SV",
        "SM", "SO", "PM", "RS", "SS", "ST", "SR", "SK", "SI", "SE", "SZ", "SX", "SC", "SY", "TC",
        "TD", "TG", "TH", "TJ", "TK", "TM", "TL", "TO", "TT", "TN", "TR", "TV", "TW", "TZ", "UG",
        "UA", "UM", "UY", "US", "UZ", "VA", "VC", "VE", "VN", "VG", "VI", "VU", "WF", "WS", "YE",
        "ZA", "ZM", "ZW"
    ];

    const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    const set_country_code_value = (value) => {
        props.set_country_code(value)
    }
    const set_set_contact_no_value = (value) => {
        props.set_contact_no(value)
        set_contact_number(value)
    }

     useEffect(() => {
    set_contact_number(props.contact);
  }, [props.contact]);

    const selectBefore = (

        // <Select defaultValue={props.country} onChange={value => set_country_code_value(value)}>
        //     {countries.map(code => (
        //         <Option key={code} value={code}>
        //             <img
        //                 src={getFlagUrl(code)}
        //                 alt={code}
        //                 style={{ width: "20px", height: "15px", marginRight: 8, verticalAlign: "middle", position: "relative", top: "-2px" }}
        //             />
        //             {code}
        //         </Option>
        //     ))}
        // </Select>
        <Select
  value={props.country}
  onChange={set_country_code_value}
  options={countries.map(code => ({
    value: code,
    label: (
      <>
        <img
          src={getFlagUrl(code)}
          alt={code}
          style={{
            width: "20px",
            height: "15px",
            marginRight: 8,
            verticalAlign: "middle"
          }}
        />
        {code}
      </>
    )
  }))}
/>

    );
    return (
        <div>
            <Input
                addonBefore={selectBefore}
                placeholder="Contact No"
                value={contact_number}
                onChange={(e) => set_set_contact_no_value(e.target.value)}
                onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // block non-numeric keys
                    }
                }}
                maxLength={10}
            />
        </div>
    );
}

export default LmsCountryDropdown;