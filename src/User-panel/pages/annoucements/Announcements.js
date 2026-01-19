import { Card, List, Image, Typography, Pagination } from 'antd'
import dayjs from 'dayjs'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { NEWS_LIST } from '../../apis/apis';
import CulsightPageLoader from '../../components/CulsightPageLoader';
import { NotificationFilled } from '@ant-design/icons';

const { Title, } = Typography;

function Announcements() {



  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  // const [pagination_loader, set_pagination_loader] = useState(false);
  const [list_data, set_list_data] = useState([]);
  const [current_page, set_current_page] = useState("");
  const [total_pages, set_total_pages] = useState("");
  const [total_news, set_total_news] = useState("");
  // const [search_query_title, set_search_query_title] = useState("");
  const [page_size, set_page_size] = useState(10)


  useEffect(() => {
    setLoader(true);
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("per_page", page_size);
      const API_CALL = await NEWS_LIST(FORM_DATA);
      if (API_CALL?.data?.status) {
        set_list_data(API_CALL?.data?.data);
        set_current_page(API_CALL?.data?.current_page);
        set_total_pages(API_CALL?.data?.total_pages);
        set_total_news(API_CALL?.data?.total_news);
        setLoader(false);
      } else {
        setLoader(false);
      }
    };
    LIST_API();
  }, [page_size]);

  const pagination_on_change = async (page, size) => {
    setLoader(true);
    const FORM_DATA = new FormData();
    FORM_DATA.append("page", page);
    FORM_DATA.append("per_page", size);
    // FORM_DATA.append("title", search_query_title);

    const API_CALL = await NEWS_LIST(FORM_DATA);
    if (API_CALL?.data?.status) {
      set_list_data(API_CALL?.data?.data);
      set_current_page(API_CALL?.data?.current_page);
      set_total_pages(API_CALL?.data?.total_pages);
      set_total_news(API_CALL?.data?.total_news);
    }
    setLoader(false);
  };


  return (
    <div className="lms-body">
      <Card>
        <h2> <NotificationFilled style={{color:"#e9c70ada"}} /> {" "}Announcements</h2>

        {loader ? (
          <CulsightPageLoader />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={list_data}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    item.image && (
                      <Image
                        width={120}
                        src={item.image}
                        alt={item.title}
                        style={{ borderRadius: 6 }}
                        preview={false}
                      />
                    )
                  }
                  title={<Title level={5}>{item.title}</Title>}
                  description={
                    <span type="secondary">
                      Published on :- {dayjs(item.created_at).format("DD MMM YYYY")}
                    </span>
                  }
                />

                <p ellipsis={{ rows: 3 }}>
                  {item.short_description || "No description available"}
                </p>

                <div style={{ textAlign: "right" }}>
                  <span
                    type="primary"
                    style={{ cursor: "pointer",color:"#e9c70ada" }}
                    onClick={() => navigate(`/view-announcements/${btoa(item.id)}`)}
                  >
                    Read More →
                  </span>
                </div>
              </List.Item>
            )}
          />

        )}

              {total_pages > 0 ? (
            <>
              <div style={{ float: "right", marginTop: "20px" }}>
                {" "}
                <Pagination
                  current={current_page}
                  total={total_news}
                  pageSize={page_size}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50', '100']}
                  onChange={pagination_on_change}
                  onShowSizeChange={(current, size) => {
                    set_page_size(size);
                    pagination_on_change(1, size);
                  }}
                  style={{ display: 'inline-block' }}
                  className="no-search-pagination"
                />
                <style>
                  {`
                    .no-search-pagination .ant-select-selection-search-input {
                      display: none !important;
                    }
                  `}
                </style>
              </div>
            </>
          ) : (
            ""
          )}
        
      </Card>
    </div>
  )
}

export default Announcements
