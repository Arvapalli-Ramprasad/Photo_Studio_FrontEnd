import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./MediaPage.css";
import api from "./api";

const MediaPage = () => {
  const {eventId } = useParams();
  const [media, setMedia] = useState([]);
  const [message, setMessage] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("IMAGE"); // ✅ NEW

  const [pressTimer, setPressTimer] = useState(null);

// CTRL / CMD + CLICK or selection mode
const handleCardClick = (e, itemId, index) => {
  // Desktop multi-select
  if (e.ctrlKey || e.metaKey) {
    toggleSelect(itemId);
    return;
  }

  // If already selecting → keep selecting
  if (selected.length > 0) {
    toggleSelect(itemId);
    return;
  }

  // Normal click → open lightbox
  setLightboxIndex(index);
  };

// MOBILE LONG PRESS
const handleTouchStart = (id) => {
  const timer = setTimeout(() => {
    toggleSelect(id);
  }, 500); // 500ms long press

  setPressTimer(timer);
};

const handleTouchEnd = () => {
  clearTimeout(pressTimer);
};



  const token = JSON.parse(localStorage.getItem("token"));

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const payload = token ? parseJwt(token) : null;
const roles = payload?.role || [];
const isAdmin = roles.includes("ROLE_ADMIN");

  //================= FETCH =================
  const fetchMedia = async () => {
    try {
      const res = await api.get(`/media/${eventId}`);

      if (res.data.length === 0) {
        setMessage("No Media Added yet. Upload files to view.");
        setMedia([]);
        return;
      }

      setMedia(res.data);
      setMessage("");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  //================= FILTER =================
  const filteredMedia = media.filter((item) => item.type === activeTab);

  // Reset lightbox when tab changes
  useEffect(() => {
    setLightboxIndex(filteredMedia.length ? 0 : null);
  }, [activeTab, media]);


  // 🔹 sanitize file name
const sanitizeFileName = (name) => {
  return name
    .replace(/\s+/g, "_")          // replace spaces with _
    .replace(/[^\w.-]/g, "")       // remove special chars
};

  // ================= UPLOAD =================
const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please select files");
      return;
    }

    const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_VIDEO_SIZE = 1000 * 1024 * 1024; // 1000MB
    const MAX_OTHER_SIZE = 1000 * 1024 * 1024;

    try {
      let uploadedCount = 0;
      const totalFiles = files.length;

      await Promise.all(
        Array.from(files).map(async (file) => {
          try {
            const isImage = file.type?.startsWith("image/");
            const isVideo = file.type?.startsWith("video/");
            const isUnknown = !file.type || file.type === "application/octet-stream";  //“This is just raw data — I don’t know what kind of file this is.”

            if (isImage && file.size > MAX_IMAGE_SIZE) {
              throw new Error(`Image too large: ${file.name}`);
            }

            if (isVideo && file.size > MAX_VIDEO_SIZE) {
              throw new Error(`Video too large: ${file.name}`);
            }

            if (isUnknown && file.size > MAX_OTHER_SIZE) {
              throw new Error(`File too large: ${file.name}`);
            }

            // create safe filename
            const safeFileName = `${Date.now()}_${sanitizeFileName(file.name)}`;

            // 🔹 Get presigned URL
            const res = await api.get(
              `/media/presigned-url`,
              {
                params: {
                  fileName: safeFileName,
                  fileType: file.type || "application/octet-stream",
                },
              }
            );

            const { url, key } = res.data;

            // 🔹 Upload to S3
            await axios.put(url, file, {
              headers: {
                "Content-Type": file.type || "application/octet-stream",
              },
              onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`${file.name}: ${percent}%`);
              },
            });

            // 🔹 Save metadata
           const fileUrl = `${process.env.REACT_APP_S3_BASE_URL}/${key}`;

            await api.post(`/media/save`, {
              eventId,
              url: fileUrl,
              fileName: file.name,
              contentType: file.type || "application/octet-stream",
              size: file.size,
              type: file.type?.startsWith("video/") ? "video" : "image",
              uploadedBy: "ADMIN",
            });

            uploadedCount++;
            const overall = Math.round((uploadedCount * 100) / totalFiles);
            setProgress(overall);

          } catch (err) {
            console.error(`Error uploading ${file.name}`, err.message);
          }
        })
      );

      setProgress(0);
      setFiles([]);
      fetchMedia();

    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // ================= DELETE =================
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    try {
      await api.delete("/media/delete", {
        data: { mediaIds: selected },
      });
      setSelected([]);
      fetchMedia();
    } catch (e) {
      console.error(e);
    }
  };

  // ================= LIGHTBOX =================
  const prevLightbox = () => {
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : filteredMedia.length - 1
    );
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) =>
      prev < filteredMedia.length - 1 ? prev + 1 : 0
    );
  };

  return (
  <div className="media-page">

    {/* HEADER */}
    <div className="media-header">
      <h1>✨ Capturing Moments That Last Forever</h1>
      <p className="subtitle">
        Explore stunning memories from this event. Every frame tells a story of joy,
        celebration, and unforgettable experiences.
      </p>
    </div>

    {/* USER NOTE */}
    {!isAdmin && (
      <div className="viewer-note">
        📸 Browse through beautiful captures from this event.
        Tap any image to view. Long press to select.
      </div>
    )}

    {/* ADMIN CONTROLS */}
    {isAdmin && (
      <div className="controls">
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />

        <button className="upload-btn" onClick={handleUpload}>
          🚀 Upload Media
        </button>

        {selected.length > 0 && (
          <button className="delete-btn" onClick={deleteSelected}>
            ❌ Delete ({selected.length})
          </button>
        )}
      </div>
    )}

    {/* PROGRESS */}
    {progress > 0 && (
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-bar-inner"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress}%</p>
      </div>
    )}

    {/* TOGGLE */}
    <div className="media-toggle">
      <button
        className={activeTab === "IMAGE" ? "active" : ""}
        onClick={() => setActiveTab("IMAGE")}
      >
        Images
      </button>

      <button
        className={activeTab === "VIDEO" ? "active" : ""}
        onClick={() => setActiveTab("VIDEO")}
      >
        Videos
      </button>
    </div>

    {/* LIGHTBOX */}
    {lightboxIndex !== null && filteredMedia[lightboxIndex] && (
      <div className={`lightbox ${fullscreen ? "fullscreen" : ""}`}>
        <button className="arrow left" onClick={prevLightbox}>
          &#10094;
        </button>

        {filteredMedia[lightboxIndex].type === "IMAGE" ? (
          <img
            src={filteredMedia[lightboxIndex].url}
            alt=""
            onClick={() => setFullscreen(!fullscreen)}
          />
        ) : (
          <video
            src={filteredMedia[lightboxIndex].url}
            controls
            onClick={() => setFullscreen(!fullscreen)}
          />
        )}

        <button className="arrow right" onClick={nextLightbox}>
          &#10095;
        </button>
      </div>
    )}

    {/* SELECTION BAR (PRO UX) */}
    {selected.length > 0 && (
      <div className="selection-bar">
        {selected.length} selected
      </div>
    )}

    {/* GRID */}
    <div className="grid">
      {filteredMedia.map((item, index) => (
        <div
          key={item.id}
          className={`card ${selected.includes(item.id) ? "selected" : ""}`}

          onClick={(e) => handleCardClick(e, item.id, index)}

          onTouchStart={() => handleTouchStart(item.id)}
          onTouchEnd={handleTouchEnd}
        >
          {item.type === "IMAGE" ? (
            <img src={item.url} alt="" />
          ) : (
            <video src={item.url} />
          )}
        </div>
      ))}
    </div>

  </div>
);
};

export default MediaPage;