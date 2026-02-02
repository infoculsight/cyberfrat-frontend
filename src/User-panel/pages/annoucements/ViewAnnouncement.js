import { Card, Spin, Image, Button } from "antd";
import React, { useEffect, useState } from "react";
import { VIEW_NEWS } from "../../apis/apis";
import { useNavigate, useParams } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import CulsightPageLoader from "../../components/CulsightPageLoader"

function ViewAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loader, setLoader] = useState(true);
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const formData = new FormData();
        formData.append("id", id ? atob(id) : "");

        const res = await VIEW_NEWS(formData);

        if (res?.data?.status) {
          setNews(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loader) {
    return (
      <div className="lms-body" style={{ textAlign: "center", marginTop: 50 }}>
       <CulsightPageLoader />
      </div>
    );
  }

  return (
    <div className="lms-body">
  
    <span style={{cursor:"pointer"}} onClick={()=> navigate("/announcements")}><LeftOutlined /> Go Back</span>
      <Card>
        {news?.image && (
          <Image
            width={300}
            src={news.image}
            style={{ marginBottom: 20 }}
          />
        )}

        <h2>{news?.title || "No Title"}</h2>

        {news?.short_description && (
          <p><strong>{news.short_description}</strong></p>
        )}

        <p>{news?.description}</p>
      </Card>
    </div>
  );
}

export default ViewAnnouncement;
