import React, { useEffect, useState } from "react";
import { Collapse, Button, Divider, Modal } from "antd";
import AddChapterSection from "./AddChapterSection";
import EditChapterSection from "./EditChapterSection";
import { CHAPTER_SECTION_LIST, DELETE_STATUS } from "../../../../../apis/apis";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import SectionVideos from "../sectionmedia/videos/sectionVideos";

const { Panel } = Collapse;

const ChapterSection = (props) => {
  const [items, setItems] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editSectionData, setEditSectionData] = useState(null);
  const [activeKey, setActiveKey] = useState([]); // collapsed by default
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const showAddModal = () => setIsAddModalVisible(true);
  const handleAddCancel = () => setIsAddModalVisible(false);

  const showEditModal = (section) => {
    setEditSectionData(section);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditSectionData(null);
  };

  const handleSectionAdded = (sectionData) => {
    const newKey = String(sectionData.id);
    const newItem = {
      key: newKey,
      label: sectionData.title,
      data: sectionData,
    };
    setItems((prev) => [...prev, newItem]);
    setActiveKey([newKey]); // open newly added section
    setIsAddModalVisible(false);
  };

  const handleSectionUpdated = (updatedData) => {
    const updatedItems = items.map((item) =>
      item.data.id === updatedData.id
        ? {
            ...item,
            label: updatedData.title,
            data: updatedData,
          }
        : item
    );
    setItems(updatedItems);
    setActiveKey([String(updatedData.id)]);
    handleEditCancel();
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    const formData = new FormData();
    formData.append("section_id", sectionToDelete.id);

    try {
      const res = await DELETE_STATUS(formData);
      if (res?.data?.status) {
        setItems((prev) =>
          prev.filter((item) => item.data.id !== sectionToDelete.id)
        );
        setActiveKey([]); // collapse all after delete
      } else {
        console.error("Delete failed:", res?.data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteModalVisible(false);
      setSectionToDelete(null);
    }
  };

  useEffect(() => {
    const LIST_API = async () => {
      const FORM_DATA = new FormData();
      FORM_DATA.append("chapter_id", atob(props.chapter_id));
      try {
        const API_CALL = await CHAPTER_SECTION_LIST(FORM_DATA);
        if (API_CALL?.data?.status) {
          const formattedItems = API_CALL.data?.data.map((section) => ({
            key: String(section.id),
            label: section.title,
            data: section,
          }));
          setItems(formattedItems);
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
  }, [props.chapter_id]);

  return (
    <div>
      {/* Header with Divider and Button */}
      <div style={{ minHeight: "60px", display: "block", position: "relative" }}>
        <Divider orientation="left">   {isAddModalVisible ? " Add Chapter Section" : "Section List"}</Divider>
        <div style={{ position: "absolute", right: "0px", top: "0px" }}>
          <Button
            type="primary"
            onClick= {isAddModalVisible ? handleAddCancel : showAddModal}
            style={{ marginBottom: 16 }}
          >
            {isAddModalVisible ? "List Sections" : " Add Chapter Section"}
          </Button>
        </div>
      </div>
{isAddModalVisible ?  <AddChapterSection
          chapter_id={props.chapter_id}
          course_id={props.course_id}
          onAddSuccess={handleSectionAdded}
          onCancel={handleAddCancel}
        /> : <>
      {/* Loader */}
      {loading ? (
        <CulsightPageLoader />
      ) : (
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key ? [key] : [])}
        >
          {items.map((item) => (
            <Panel
              key={item.key}
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{item.label}</span>
                  <Button
                    size="small"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      setSectionToDelete(item.data);
                      setDeleteModalVisible(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              }
            >
              <div className="section-details section-details-right-padding">
                <p>
                  <img
                    src={item?.data?.image}
                    alt="Section"
                    style={{ maxWidth: "250px", marginBottom: 8 }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.data?.description,
                    }}
                  ></div>
                </p>
                <h4 style={{ marginBottom: "10px" }}>
                  <span style={{ color: "#6ca9ff" }}>Section Tags: </span>
                  {item?.data?.tags}
                </h4>
                <br />
                <Button
                  size="small"
                  className="edit-section-btn"
                  type="primary"
                  onClick={() => showEditModal(item.data)}
                  style={{ marginRight: 8 }}
                >
                  Update Section
                </Button>
              </div>
              <br />
              <SectionVideos
                chapter_id={atob(props.chapter_id)}
                section_id={item?.data?.id}
              />
            </Panel>
          ))}
        </Collapse>
      )}
</>}
     

      {/* Edit Modal */}
      <Modal
        title="Edit Chapter Section"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        destroyOnClose
        width={800}
      >
        {editSectionData && (
          <EditChapterSection
            section_id={editSectionData?.id}
            sectionData={editSectionData}
            onAddSuccess={handleSectionUpdated}
            onClose={handleEditCancel}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={confirmDeleteSection}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSectionToDelete(null);
        }}
        okText="Yes, Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the section:{" "}
          <strong>{sectionToDelete?.title}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default ChapterSection;
