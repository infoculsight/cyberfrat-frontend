import { Switch } from 'antd';
import { SunFilled, MoonFilled } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { ADD_THEME_VIEW, THEME_VIEW } from '../apis/apis';

function ThemeSetting() {
    const [dark_theme, set_dark_theme] = useState(0);

    useEffect(() => {
         const local_theme = localStorage.getItem("dark_theme")
         local_theme === 'dark' ? set_dark_theme(1) : set_dark_theme(0)
    },[])

    const handleThemeChange = (checked) => {
       
       const local_theme = localStorage.getItem("dark_theme")
       if( local_theme === 'dark'){
         localStorage.setItem("dark_theme", 'light')
         set_dark_theme(0)
       
       }else{
         localStorage.setItem("dark_theme",'dark')
         set_dark_theme(1)
        
       }
      window.location.reload();
         
    };

 

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