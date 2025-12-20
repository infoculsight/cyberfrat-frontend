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
  const skipDetectedAtRef = useRef(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [api_disabled, set_api_disabled] = useState(false);
  const [single_progress, set_single_progress] = useState(last_progress);

  const playbackRate = 1.0;
  const lastWatchedKey = `video-progress-${chapter_id}-${btoa(row_id)}`;
  const lastWatchedTime = useRef(video_row?.watched_seconds || 1);
  const isInitialSeek = useRef(true);

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
    if (apirs?.data?.course_watch_percent) {
      set_course_watch_percent(apirs?.data?.course_watch_percent);
    }

    set_video_api_refresh(!video_api_refresh);
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isInitialSeek.current) {
      isInitialSeek.current = false;
      return;
    }

    if (!apiDisabledRef.current) {
      apiDisabledRef.current = true;
      skipDetectedAtRef.current = Date.now();
      set_api_disabled(true);
      console.warn("⚠️ Skip detected — API tracking disabled");
    }
  };

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

  useEffect(() => {
    const now = Date.now();
    if (apiDisabledRef.current || now - skipDetectedAtRef.current < 1000) return;

    if (single_progress > 0 && single_progress % 2 === 0) {
      sendProgressToBackend(single_progress);
    }
  }, [single_progress]);

  const handlePlaybackRateChange = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.playbackRate > 1.0 && !apiDisabledRef.current) {
      apiDisabledRef.current = true;
      set_api_disabled(true);
      console.warn("⚠️ Playback speed > 1.0 detected — API tracking disabled");
    }
  };

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    let hls;

    const setupHandlers = () => {
      video.addEventListener("ratechange", handlePlaybackRateChange);
      video.playbackRate = 1.0;
    };

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.currentTime = lastWatchedTime.current;
        isInitialSeek.current = true;
        video.play().catch(() => { });
        setIsPlaying(true);
        setupHandlers();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = lastWatchedTime.current;
        isInitialSeek.current = true;
        video.play().catch(() => { });
        setIsPlaying(true);
        setupHandlers();
      });
    }

    return () => {
      hls && hls.destroy();
      video?.removeEventListener("ratechange", handlePlaybackRateChange);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return loading ? (
    <CulsightPageLoader />
  ) : (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        maxWidth: "100vw",
      }}
    >
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
          minHeight: "40vh",
          maxHeight: "80vh",
          objectFit: "contain",
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
          width: "20vw",
          maxWidth: "120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "55px",
          right: "20px",
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
            fontSize: "16px",
          }}
        >
          ⚠️ Tracking paused as video was skipped. Refresh and continue to resume.
        </div>
      ) : (
        <div
          style={{
            color: "#e9c70ada",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "5px",
            fontSize: "16px",
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
