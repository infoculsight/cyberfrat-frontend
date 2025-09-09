/* eslint-disable no-unused-vars */
import { Card, Col, Image, Pagination, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import {
    LoadingOutlined,
} from "@ant-design/icons";
import { MEDIA_IMAGE_LISTING } from "../../../apis/apis";
import CulsightPageLoader from "../../../components/CulsightPageLoader";

function MediaImages(props) {
    // Media States
    const [loader, setLoader] = useState(true);
    const [pagination_loader, set_pagination_loader] = useState(false);
    const [images_data, set_images_data] = useState([]);
    const [current_page, set_current_page] = useState('');
    const [total_pages, set_total_pages] = useState('');
    const [total_files, set_total_files] = useState('');



    useEffect(() => {
        const LIST_API = async () => {
            const FORM_DATA = new FormData();
            FORM_DATA.append('folder', props.folder_name);
            const API_CALL = await MEDIA_IMAGE_LISTING(FORM_DATA);
            if (API_CALL?.data?.status) {
                //   set_table_data(API_CALL?.data?.data);
                set_current_page(API_CALL?.data?.page);
                set_total_pages(API_CALL?.data?.total_pages);
                set_total_files(API_CALL?.data?.total_files);
                set_images_data(API_CALL?.data?.data)
              
                setLoader(false);
            } else {
                console.log("error");
                setLoader(false);
            }
        };
        LIST_API();
    }, [props.folder_name]);

    const pagination_on_change = async (data) => {
        set_pagination_loader(true)
        const FORM_DATA = new FormData();
        FORM_DATA.append('folder', props.folder_name);
        FORM_DATA.append('page', data);
        const API_CALL = await MEDIA_IMAGE_LISTING(FORM_DATA);
        if (API_CALL?.data?.status) {
            //   set_table_data(API_CALL?.data?.data);
            set_current_page(API_CALL?.data?.page);
            set_total_pages(API_CALL?.data?.total_pages);
            set_total_files(API_CALL?.data?.total_files);
            set_images_data(API_CALL?.data?.data)
            set_pagination_loader(false);
        } else {
            set_pagination_loader(false);
        }
    }
    return (
        <div>

            {loader ? (
                <>
                    <CulsightPageLoader />
                </>
            ) : (
                <>
                    {pagination_loader ? (
                        <>
                            <div style={{ textAlign: "center", padding: "60px" }}>
                                <Spin indicator={<LoadingOutlined spin />} size="large" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Row gutter={[16, 16]} align="middle">
                                {images_data?.length > 0 ? <>
                                    {images_data?.map(item => (
                                        <>
                                            <Col xs={24} sm={24} md={12} lg={6}>
                                                <Card
                                                    // style={{ minWidth: 300 }}
                                                    bodyStyle={{ padding: "0px" }}
                                                    cover={
                                                        <Image
                                                            alt="example"
                                                            src={item?.file_url}
                                                            style={{
                                                                width: "100%",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                borderTopLeftRadius: 8,
                                                                borderTopRightRadius: 8,
                                                            }}
                                                        />
                                                    }
                                                >
                                                </Card>
                                            </Col>
                                        </>
                                    ))}
                                </> : <>
                                    Empty Data

                                </>}

                            </Row>
                        </>
                    )}

                    <div style={{ float: "right", marginTop: "20px" }}> <Pagination onChange={pagination_on_change} defaultCurrent={current_page} total={total_files} /></div>
                </>
            )}


        </div>
    );
}

export default MediaImages;
