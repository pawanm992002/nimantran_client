import { useState, useRef } from "react";
import axios from "axios";
import "./WeddingVideo.css";
import DraggableResizableDiv from "../Other/DraggableResizableDiv/DraggableResizableDiv";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFileArrowUp,
  faSquarePlus,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import SideConfiguration from "../Other/sideConfiguration/SideConfiguration";

export default function WeddingVideo() {
  const videoRef = useRef();
  const [video, setVideo] = useState(null);
  const [guestNames, setGuestNames] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [count, setCount] = useState(1);
  const [onHover1, setOnHover1] = useState(false);
  const [onHover2, setOnHover2] = useState(false);
  const [onHover3, setOnHover3] = useState(false);
  const [onHover4, setOnHover4] = useState(false);
  const [isSample, setIsSample] = useState(true);

  const [scaling, setScaling] = useState({
    width: 1,
    height: 1,
  });
  const [OriginalSize, setOriginalSize] = useState({
    w: 0,
    h: 0,
  });
  const [resized, setResized] = useState({
    w: 0,
    h: 0,
  });
  const [processedVideoUrls, setProcessedVideoUrls] = useState([]);
  const [zipUrl, setZipUrl] = useState("");

  const createTextDiv = () => {
    if (!video) {
      toast.error("Please First Upload Video");
      return;
    }
    const newText = {
      id: count,
      duration: 5,
      fontColor: "#000000",
      fontFamily: "Josefin Slab",
      fontSize: 20,
      fontStyle: "normal",
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      startTime: 0,
      text: `Edit Text - ${count}`,
      backgroundColor: "none",
      hidden: false,
      transition: { type: "none", options: null },
    };
    setCount(count + 1);
    setTexts([...texts, newText]);
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoPlayer = document.getElementById("videoPlayer");

      videoPlayer.addEventListener("resize", (ev) => {
        // setScaling({
        //   width: videoPlayer.videoWidth / videoPlayer.clientWidth,
        //   height: videoPlayer.videoHeight / videoPlayer.clientHeight,
        // });
        setResized({
          w: videoPlayer.clientWidth,
          h: videoPlayer.clientHeight,
        });
        setOriginalSize({
          w: videoPlayer.videoWidth,
          h: videoPlayer.videoHeight,
        });
      });
      const fileURL = URL.createObjectURL(file);
      videoPlayer.src = fileURL;
      videoPlayer.load();
    }
    setVideo(event.target.files[0]);
  };

  const takeTextDetails = (details) => {
    const others = texts.filter((val) => val?.id !== details?.id);
    setTexts([...others, details]);
  };

  const handleGuestNamesChange = (event) => {
    event.preventDefault();
    setGuestNames(event.target.files[0]);
    // setGuestNames(event.target.value)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      let resized = document.getElementById("videoPlayer");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!guestNames && !isSample) {
        return toast.error("Please Enter Guest List");
      }

      if (!video) {
        return toast.error("Please Upload the Video");
      }

      formData.append("video", video);
      formData.append("guestNames", guestNames);
      formData.append("textProperty", JSON.stringify(texts));
      formData.append("scalingFont", scalingFont);
      formData.append("scalingW", scalingW);
      formData.append("scalingH", scalingH);
      formData.append("videoW", parseInt(OriginalSize.w));
      formData.append("videoH", parseInt(OriginalSize.h));
      formData.append("isSample", isSample);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/videoEdit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProcessedVideoUrls(response.data.videoUrls);
      setZipUrl(response.data.zipUrl);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };
  return (
    <div className="main">
      <h2 className="heading">Wedding Invitation Editor</h2>
      <div className="mainContainer">
        <form className="sidebar" onSubmit={handleSubmit}>
          <label
            className="custom-file-upload"
            onChange={handleGuestNamesChange}
            onMouseOver={() => setOnHover1(true)}
            onMouseOut={() => setOnHover1(false)}
          >
            <div className="tooltip" style={{ display: onHover1 && "flex" }}>
              Upload CSV file of Texts
            </div>
            <input type="file" accept="text/*" />
            <FontAwesomeIcon icon={faFileArrowUp} />
          </label>

          <label
            type="button"
            className="custom-file-upload"
            onClick={createTextDiv}
            onMouseOver={() => setOnHover2(true)}
            onMouseOut={() => setOnHover2(false)}
          >
            <div className="tooltip" style={{ display: onHover2 && "flex" }}>
              Add Text - {count}
            </div>
            <FontAwesomeIcon icon={faSquarePlus} />
          </label>
          <button
            type="submit"
            className="custom-file-upload"
            onMouseOver={() => setOnHover3(true)}
            onMouseOut={() => setOnHover3(false)}
          >
            <div className="tooltip" style={{ display: onHover3 && "flex" }}>
              Start Processesing
            </div>
            <FontAwesomeIcon icon={faVideo} />
          </button>

          {zipUrl && (
            <label
              className="custom-file-upload"
              onMouseOver={() => setOnHover4(true)}
              onMouseOut={() => setOnHover4(false)}
            >
              <div className="tooltip" style={{ display: onHover4 && "flex" }}>
                Download All Videos in Zip
              </div>
              <a
                href={zipUrl}
                download="processed_videos.zip"
                style={{ color: "black" }}
              >
                <FontAwesomeIcon icon={faFileArrowDown} />
              </a>
            </label>
          )}
        </form>

        <div className="mainbar">
          {!video && (
            <label
              className="upload-container"
              onChange={handleVideoUpload}
              style={{
                height: video && "50px",
                margin: video && "0 auto",
                padding: video && "5px",
              }}
            >
              <input type="file" accept="video/*" />
              <div className="upload-content">
                <h2
                  className="upload-button"
                  style={{ fontSize: video && "15px", padding: video && "8px" }}
                >
                  Upload Video
                </h2>
                {!video && <p>or Drag & Drop a file</p>}
                {/* <p className="paste-text">paste File or URL</p> */}
              </div>
            </label>
          )}
          <div
            className="videoContainer"
            style={{ display: !video ? "none" : "flex" }}
          >
            {/* <div className="app"> */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              ref={videoRef}
            >
              <video
                controls
                style={{
                  backgroundColor: "#000",
                  width: "100%",
                  maxHeight: "calc(var(--contentMaxHeight) - 90px)",
                  margin: "0px",
                }}
                id="videoPlayer"
              />
              <div style={{ position: "absolute", top: 0, left: 0 }}>
                {texts?.map((val) => (
                  <DraggableResizableDiv
                    openContextMenuId={openContextMenuId}
                    setOpenContextMenuId={setOpenContextMenuId}
                    key={val?.id}
                    videoRef={videoRef}
                    takeTextDetails={takeTextDetails}
                    property={val}
                    videoCenter={resized.w / 2}
                    comp="video"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {video && (
          <SideConfiguration
            isSample={isSample}
            setIsSample={setIsSample}
            texts={texts}
            setTexts={setTexts}
          />
        )}
      </div>

      {processedVideoUrls.length > 0 && (
        <h2 className="heading">Processed Videos</h2>
      )}
      {processedVideoUrls.length > 0 && (
        <div className="processed_videos_container">
          {processedVideoUrls.map((url, index) => (
            <div key={index} className="processed_videos">
              <video src={url.link} controls style={{ maxHeight: "400px" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
