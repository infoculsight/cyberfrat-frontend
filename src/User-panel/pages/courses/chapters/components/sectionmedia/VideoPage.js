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
  single_progress,
  set_single_progress,
  set_video_api_refresh,
  chapter_id,
  video_row
}) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [segments, setSegments] = useState([]);
  const playbackRate = 1.0;

  const lastWatchedKey = `video-progress-${chapter_id}-${btoa(row_id)}`;
  const lastWatchedTime = useRef(video_row?.watched_seconds || 0);

  // ✅ New flags for skip detection and API control
  const hasUserSkipped = useRef(false);
  const apiTriggered = useRef(false);

  // 🔹 Reset flags on new video
  useEffect(() => {
    hasUserSkipped.current = false;
    apiTriggered.current = false;
  }, [video_id]);

  // 🔹 Handle Fullscreen logo size change
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
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, []);

  // 🔹 Fetch video URL
  useEffect(() => {
    const fetchVideoUrl = async () => {
      setLoading(true);
      const FORM_DATA = new FormData();
      FORM_DATA.append("url", video_id);
      const API_CALL = await VIDEO_PLAYER_URL(FORM_DATA);
      if (API_CALL?.data?.status) {
        setVideoUrl(API_CALL?.data?.video_url);
      }
      setLoading(false);
    };
    fetchVideoUrl();
  }, [video_id]);

  // 🔹 Send progress to backend
  const sendProgressToBackend = async (single_progress) => {
    const video = videoRef.current;
    if (!video) return;
    const FORM_DATA = new FormData();
    FORM_DATA.append("video_id", row_id);
    FORM_DATA.append("single_progress", single_progress);
    FORM_DATA.append("chapter_id", atob(chapter_id));
    FORM_DATA.append("watched_seconds", parseFloat(lastWatchedTime.current.toFixed(1)));
    FORM_DATA.append("total_seconds", parseFloat(video.duration?.toFixed(1)) || 0);
    await VIDEO_TRACK_PROGRESS(FORM_DATA);
  };

  useEffect(() => {
    if (single_progress > 0 && single_progress % 5 === 0) {
      sendProgressToBackend(single_progress);
    }
  }, [single_progress]);

  // 🔹 Track video progress and trigger at 90%
  const handleTimeUpdate = () => {
    const video = videoRef.current;
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

      // ✅ If reached 90% and no skip, trigger API once
      if (percent >= 90 && !hasUserSkipped.current && !apiTriggered.current) {
        apiTriggered.current = true;
        sendProgressToBackend(90);
        console.log("✅ 90% reached without skip — API triggered");
      }
    }
  };

  // 🔹 Prevent skipping forward
  const handleSeeking = () => {
    const video = videoRef.current;
    if (video.currentTime > lastWatchedTime.current + 2) {
      hasUserSkipped.current = true; // ✅ mark user skipped
      video.currentTime = lastWatchedTime.current;
      console.warn("⚠️ Skip attempt detected!");
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    sendProgressToBackend();
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // 🔹 Pause video on tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (document.hidden && video && !video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 🔹 Load HLS stream
  useEffect(() => {
    if (!videoUrl) return;
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const video = videoRef.current;
        video.currentTime = lastWatchedTime.current;
        video.play();
        setIsPlaying(true);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      const video = videoRef.current;
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = lastWatchedTime.current;
        video.play();
        setIsPlaying(true);
      });
    }

    const handleLoaded = () => {
      const dur = videoRef.current.duration;
      setDuration(dur);

      const chunkSize = dur / 10;
      const segs = [];
      for (let i = 0; i < 10; i++) {
        const start = i * chunkSize;
        const end = Math.min(dur, (i + 1) * chunkSize);
        segs.push({ label: `Part ${i + 1} (${formatTime(start)} - ${formatTime(end)})`, value: start });
      }
      setSegments(segs);
    };

    videoRef.current.addEventListener("loadedmetadata", handleLoaded);
    window.addEventListener("beforeunload", sendProgressToBackend);
    return () => {
      if (hls) hls.destroy();
      sendProgressToBackend();
      window.removeEventListener("beforeunload", sendProgressToBackend);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return loading ? (
    <CulsightPageLoader />
  ) : (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onPause={handlePause}
        controls
        width="100%"
        style={{
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          marginBottom: "10px",
          minHeight: "64vh",
        }}
      />

      {/* ✅ Watermark Logo */}
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

      {/* ✅ Watermark Text */}
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

      <Space wrap style={{ marginTop: "10px" }}></Space>
    </div>
  );
};

export default VideoPage;
