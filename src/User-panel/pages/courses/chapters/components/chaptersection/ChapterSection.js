import React, { useEffect, useState } from "react";
import { Button, Col, Divider, List, Progress, Row } from "antd";

import { CHAPTER_SECTION_LIST, LIST_ENABLED_SECTION } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import SectionVideos from "../sectionmedia/sectionVideos";
import { TruncatedHTMLList } from "../../../../../components/TruncatedHTML";


const ChapterSection = (props) => {
  const [loading, setLoading] = useState(true);
  const [section_data, set_section_data] = useState([]);
   const [en_section_data, set_en_section_data] = useState([]);
  const [current_page, set_current_page] = useState('');
  const [total_sections, set_total_sections] = useState(0);

  
  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(props.chapter_id));

      try {
        const API_CALL = await CHAPTER_SECTION_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_section_data(API_CALL?.data?.data);
          set_current_page(API_CALL?.data?.current_page || 1);
          set_total_sections(API_CALL?.data?.total_sections || 0);
        } else {
          console.error("API error:", API_CALL);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    LIST_API();

     const EN_LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(props.chapter_id));

      try {
        const API_CALL = await LIST_ENABLED_SECTION(FORM_DATA);
        if (API_CALL?.data?.status) {
          set_en_section_data(API_CALL?.data?.data);
        } else {
          console.error("API error:", API_CALL);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    EN_LIST_API();
  }, [props.chapter_id]);

  const pagination_on_change = async (page) => {
    set_current_page(page)
    setLoading(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("chapter_id", atob(props.chapter_id));

    try {
      const API_CALL = await CHAPTER_SECTION_LIST(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_section_data(API_CALL.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_sections(API_CALL?.data?.total_sections);
      }
    } catch (error) {
      console.error("Pagination error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "0px -10px" }}>
      <Row gutter={20}>
        <Col xs={2} sm={4} md={6} lg={8} xl={16}>
          {loading ? (
            <CulsightPageLoader />
          ) : (
            <>
              {section_data.map((section) => (
                <div key={section.id} style={{ backgroundColor: "rgb(44 44 44)", marginTop: "30px", padding: "15px", borderRadius: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #575757ff",
                      marginBottom: "20px",
                      paddingBottom: "20px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}><span style={{color:"#36fdfd"}}>SECTION- </span>{section.title}</h3>
                    {section?.progress >= 90 ? <><Button type="primary" onClick={() => pagination_on_change(parseInt(current_page)+1 > total_sections ? 1 : parseInt(current_page)+1)}>Next Section</Button></> :<>
                    <Button type="primary" disabled>Next Section</Button>
                    
                    </> }
                    
                  </div>
                  <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

                    <div>
                      <img
                        src={section.image}
                        alt="Section"
                        style={{ width: "250px", borderRadius: "8px" }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: section.description,
                        }}
                        style={{ marginBottom: "16px" }}
                      ></div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Progress
                          percent={section.progress || 0}
                          size="default"
                          style={{ flex: 1, marginRight: "20px" }}
                        />
                       
                      </div>

                    </div>
                  </div>
                    {section.title}
                  <h3 style={{ marginTop: "35px" }}>Section Media</h3>
                
                  <SectionVideos
                    chapter_id={props.chapter_id}
                    section_id={section.id}
                  />

                  <Divider />
                </div>
              ))}
            </>
          )}
        </Col>
        <Col xs={20} sm={16} md={12} lg={8} xl={8}>
          {loading ? <><CulsightPageLoader /> </> : <>
           <List
            loading={loading}
            header={<div>Sections List</div>}
            bordered
            itemLayout="vertical"
            style={{ backgroundColor: "rgb(44 44 44)", marginTop: "30px" }}
            dataSource={en_section_data}
            renderItem={(item, index) => (
              <List.Item
                key={item.id || item.title}

                extra={
                  item.image ? (
                    <img width={100} alt="example" src={item.image} />
                  ) : null
                }
              >
                <List.Item.Meta
                  title={item.title}

                  description={
                    <>
                      {item.introduction && (
                        <TruncatedHTMLList html={item.introduction} />
                      )}
                      {item?.progress >= 90 ? <><Button size="small" variant="solid" color="green" type="primary" onClick={() => pagination_on_change(index + 1)}>View</Button></> :<>
                      {item?.progress > 0 && <>
                      <Button size="small" variant="solid" color="orange" type="primary" onClick={() => pagination_on_change(index + 1)}>Currently Reading</Button>
                      </>}
                      
                      </>}
                      <div style={{ marginTop: 8 }}>
                        <Progress
                          percent={item.progress}
                          status="active"
                        />
                      </div>
                    </>
                  }
                />
                {item.content}
              </List.Item>
            )}

          />
          </>}
         
        </Col>
      </Row>







    </div>
  );
};

export default ChapterSection;
