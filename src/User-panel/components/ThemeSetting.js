import { Switch } from 'antd';
import { SunFilled, MoonFilled } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { ADD_THEME_VIEW, THEME_VIEW } from '../apis/apis';

function ThemeSetting() {
    const [dark_theme, set_dark_theme] = useState(0);

    const send_theme_to_api = async (value) => {
        const FORM_DATA = new FormData();
        FORM_DATA.append("dark_theme", value ? 1 : 0);  

        try {
            const API_CALL = await ADD_THEME_VIEW(FORM_DATA);
            if (API_CALL?.data?.status) {
                localStorage.setItem("dark_theme", value ? "1" : "0");
                window.location.reload();
            } else {
              
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleThemeChange = (checked) => {
        set_dark_theme(checked);
        send_theme_to_api(checked); 
    };

    const get_theme_from_api = async () => {
        try {
            const response = await THEME_VIEW();
            const currentTheme = response?.data?.dark_theme;
            set_dark_theme(currentTheme ? 1 : 0);
            localStorage.setItem("dark_theme", currentTheme ? "1" : "0");
        } catch (error) {
            console.error("Failed to fetch theme:", error);
        }
    };
        useEffect(() => {
            const saved_theme = localStorage.getItem("dark_theme");
        if (saved_theme !== null) {
            set_dark_theme(parseInt(saved_theme));
        }
        get_theme_from_api();
    }, []);

    return (
        <div>
            <Switch
                checked={dark_theme}
                onChange={handleThemeChange}
                checkedChildren={<SunFilled />}
                unCheckedChildren={<MoonFilled />}
                style={{
                    transform: "scale(1.3)",
                    marginTop:"-10px"
                }}
            />
        </div>
    );
}

export default ThemeSetting;