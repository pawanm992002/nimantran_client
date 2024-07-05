import { useState, useRef } from "react";
import axios from "axios";
import "../WeddingVideo/WeddingVideo.css";
import DraggableResizableDiv from "../Other/DraggableResizableDiv";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFileArrowUp,
  faSquarePlus,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import { fontFamilies } from "../../App";

export default function WeddingImage() {

  //dragable





  
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
  const handleStyleChange = () => {};

  const deleteText = (id) => {
    setTexts(texts.filter((val) => val.id !== id));
  };
  const hideText = (details) => {
    const others = texts.filter((val) => val.id !== details.id);
    details.hidden = !details.hidden;
    setTexts([...others, details]);
  };

  console.log(isSample);
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
      toast.error("Please First Upload Image");
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

      const img = new Image();
      img.onload = () => {
        // Set the original size
        setOriginalSize({
          w: img.naturalWidth,
          h: img.naturalHeight,
        });

        // Set the resized size after the image is loaded and resized in the container
        setResized({
          w: videoPlayer.clientWidth,
          h: videoPlayer.clientHeight,
        });
      };

      const fileURL = URL.createObjectURL(file);
      img.src = fileURL;
      videoPlayer.src = fileURL;
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

  const sendIndividualInvite = async (info) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/sendIndividualInvite`,
        { senderName: "sender", mobile: "6367703375" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("hhhhhh", data);
    } catch (err) {
      console.log(err);
    }
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
      formData.append("isSample", isSample);

      const response = await axios.post(
        "http://localhost:8000/image/upload",
        formData,
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
      <div className="container">
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
              <input type="file" accept="image/*" />
              <div className="upload-content">
                <h2
                  className="upload-button"
                  style={{ fontSize: video && "15px", padding: video && "8px" }}
                >
                  Upload Image
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
              <img
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
                    comp="image"
                  />
                ))}
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="configuration">
          <h2>Text Configuration</h2>
          <div className="NoText">
            <input
              type="checkbox"
              id="sample"
              checked={isSample}
              onChange={(e) => setIsSample(JSON.parse(e.target.checked))}
            />
            <label htmlFor="sample" id="sample">
              Generate Sample Images
            </label>
          </div>
          {texts.length > 0 ? (
            texts?.map(
              ({
                id,
                text,
                fontColor,
                fontSize,
                duration,
                startTime,
                position,
                fontFamily,
                fontStyle,
                size,
                backgroundColor,
                hidden,
              }) => (
                <div
                  key={id}
                  className="context-menu"
                  style={{ position: "relative" }}
                >
                  <div>
                    <label>Text Id : {id}</label>
                  </div>
                  <div>
                    <label>
                      Font Color:
                      <input
                        className="context-property"
                        type="color"
                        name="color"
                        value={fontColor}
                        onChange={handleStyleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Background:
                      <input
                        className="context-property"
                        type="color"
                        name="backgroundColor"
                        value={backgroundColor}
                        onChange={handleStyleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Font Style:
                      <select
                        className="context-property"
                        name="style"
                        value={fontStyle}
                        onChange={handleStyleChange}
                      >
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                        <option value="oblique">Oblique</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Font Size:
                      <input
                        className="context-property"
                        type="number"
                        name="size"
                        value={fontSize}
                        onChange={handleStyleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Font Family:
                      <select
                        className="context-property"
                        name="family"
                        value={fontFamily}
                        onChange={handleStyleChange}
                      >
                        {fontFamilies.map((val, i) => (
                          <option
                            style={{ fontFamily: `${val}` }}
                            value={val}
                            key={i}
                          >
                            {val}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <label
                      style={{
                        background: "#B5B4F3",
                        textAlign: "center",
                        borderRadius: "5px",
                        padding: "0 10px",
                      }}
                      name="delete"
                      onClick={() => deleteText(id)}
                    >
                      Delete Text - {id}
                    </label>
                  </div>
                  <div>
                    <label
                      style={{
                        background: "#B5B4F3",
                        textAlign: "center",
                        borderRadius: "5px",
                        padding: "0 10px",
                      }}
                      name="hidden"
                      onClick={() =>
                        hideText({
                          id,
                          text,
                          fontColor,
                          fontSize,
                          duration,
                          startTime,
                          position,
                          fontFamily,
                          fontStyle,
                          size,
                          backgroundColor,
                          hidden,
                        })
                      }
                    >
                      {hidden ? "Show" : "Hide"} Text - {id}
                    </label>
                  </div>
                </div>
              )
            )
          ) : (
            <span className="NoText">NO TEXT</span>
          )}
          {/* </div> */}
        </div>
      </div>
      {processedVideoUrls.length > 0 && (
        <h2 className="heading">Processed Images</h2>
      )}
      {processedVideoUrls.length > 0 && (
        <div className="processed_videos_container">
          {processedVideoUrls.map((url, index) => (
            <div className="EditName" key={index}>
              <span> {url.name} </span>
              <img
                src={url.link}
                controls
                style={{ maxHeight: "400px", padding: "20px" }}
              />
              <button
                className="sendButton"
                onClick={() => sendIndividualInvite(url)}
              >
                Send
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
