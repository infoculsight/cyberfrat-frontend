import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { VIDEO_PLAYER_URL, VIDEO_TRACK_PROGRESS } from "../../../../../apis/apis";
import logo from "./../../../../../assests/CF-PPT-1.png";
import CulsightPageLoader from "../../../../../components/CulsightPageLoader";
import { Space } from "antd";

const VideoPage = ({
  video_id,
  title,
  row_id,
  set_current_video_id,
  set_video_api_refresh,
  video_api_refresh,
 last_progress,
  chapter_id,
  video_row,
  set_course_watch_percent
}) => {
  const videoRef = useRef(null);
  const apiDisabledRef = useRef(false);
  const skipDetectedAtRef = useRef(0); // ✅ new - to track when skip happened
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [api_disabled, set_api_disabled] = useState(false);
  const [single_progress, set_single_progress] = useState(last_progress);

  const playbackRate = 1.0;
  const lastWatchedKey = `video-progress-${chapter_id}-${btoa(row_id)}`;
  const lastWatchedTime = useRef(video_row?.watched_seconds || 1);
  const isInitialSeek = useRef(true);

  // ✅ Fullscreen logo adjustment
  useEffect(() => {
    const logo = document.getElementById("fullscreen-logo");
    const handleFullscreen = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      if (isFullscreen && logo) {
        logo.style.position = "fixed";
        logo.style.top = "20px";
        logo.style.left = "20px";
        logo.style.width = "120px";
      } else if (logo) {
        logo.style.position = "absolute";
        logo.style.top = "10px";
        logo.style.left = "10px";
        logo.style.width = "100px";
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  // ✅ Fetch HLS URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      setLoading(true);
      const form = new FormData();
      form.append("url", video_id);
      const res = await VIDEO_PLAYER_URL(form);
      if (res?.data?.status) setVideoUrl(res.data.video_url);
      setLoading(false);
    };
    fetchVideoUrl();
  }, [video_id]);

  // ✅ Send progress (only if not disabled)
  const sendProgressToBackend = async (progress) => {
    if (apiDisabledRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    const form = new FormData();
    form.append("video_id", row_id);
    form.append("single_progress", progress);
    form.append("chapter_id", atob(chapter_id));
    form.append("watched_seconds", parseFloat(lastWatchedTime.current.toFixed(1)));
    form.append("total_seconds", parseFloat(video.duration?.toFixed(1)) || 0);
    const apirs = await VIDEO_TRACK_PROGRESS(form);
    if(apirs?.data?.course_watch_percent){
       set_course_watch_percent(apirs?.data?.course_watch_percent)
    }
   
    set_video_api_refresh(!video_api_refresh)
  };

  // ✅ Skip detection
  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isInitialSeek.current) {
      isInitialSeek.current = false;
      return;
    }

    // ✅ First user skip → permanently disable instantly
    if (!apiDisabledRef.current) {
      apiDisabledRef.current = true;
      skipDetectedAtRef.current = Date.now(); // mark timestamp
      set_api_disabled(true);
      console.warn("⚠️ Skip detected — API tracking disabled");
    }
  };

  // ✅ Time tracking
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    const total = video.duration || 0;

    if (current > lastWatchedTime.current) {
      lastWatchedTime.current = current;
      localStorage.setItem(lastWatchedKey, current.toFixed(1));
    }

    if (total > 0) {
      const percent = (current / total) * 100;
      set_current_video_id(row_id);
      if (Math.floor(percent) > single_progress) {
        set_single_progress(Math.floor(percent));
      }
    }
  };

  // ✅ Progress API every 2%, but cancel instantly if skip within same frame
  useEffect(() => {
    const now = Date.now();

    // ✅ if skip was detected recently (within 1 second) → block even queued API
    if (apiDisabledRef.current || now - skipDetectedAtRef.current < 1000) {
      return;
    }

    if (single_progress > 0 && single_progress % 2 === 0) {
      sendProgressToBackend(single_progress);
    }
  }, [single_progress]);

  // ✅ Initialize HLS
  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = lastWatchedTime.current;
        isInitialSeek.current = true;
        video.play().catch(() => {});
        setIsPlaying(true);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = lastWatchedTime.current;
        isInitialSeek.current = true;
        video.play().catch(() => {});
        setIsPlaying(true);
      });
    }

    return () => hls && hls.destroy();
  }, [videoUrl]);

  // ✅ Maintain playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return loading ? (
    <CulsightPageLoader />
  ) : (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        controls
        width="100%"
        style={{
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          marginBottom: "10px",
          minHeight: "64vh",
        }}
      />

      <img
        id="fullscreen-logo"
        src={logo}
        alt="Watermark"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          opacity: 0.3,
          pointerEvents: "none",
          width: "120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "rgba(255,255,255,0.5)",
          pointerEvents: "none",
        }}
      >
        © cyberfrat
      </div>

      {api_disabled ? (
        <div
          style={{
            color: "red",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          ⚠️ Tracking disabled — video skipped
        </div>
      ) :(
        <div
          style={{
            color: "#e9c70ada",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          Video Tracking Start
        </div>
      )}

      <Space wrap style={{ marginTop: "10px" }}></Space>
    </div>
  );
};

export default VideoPage;