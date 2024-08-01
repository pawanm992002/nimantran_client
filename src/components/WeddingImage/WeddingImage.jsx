import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../WeddingVideo/WeddingVideo.css";
import DraggableResizableDiv from "../Other/DraggableResizableDiv/DraggableResizableDiv";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFileArrowUp,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import SideConfiguration from "../Other/sideConfiguration/SideConfiguration";
import TextEditor from "../Other/TextEditor/TextEditor";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShowSampleModal from "../Other/modal/ShowSampleModal";
import Papa from "papaparse";

export default function WeddingImage() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const videoRef = useRef();
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const [jsonData, setJsonData] = useState([
    {
      name: "Random 1",
      mobileNumber: "412658125",
    },
    {
      name: "Random 2",
      mobileNumber: "412658126",
    },
  ]);
  const [video, setVideo] = useState(null);
  const [guestNames, setGuestNames] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [count, setCount] = useState(1);
  const [onHover1, setOnHover1] = useState(false);
  const [onHover2, setOnHover2] = useState(false);
  const [onHover4, setOnHover4] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestList, setShowGuestList] = useState(true);

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
      fontWeight: "normal",
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
    console.log("wwwwwwwwwwwwwwww", details);
    const others = texts.filter((val) => val?.id !== details?.id);
    setTexts([...others, details]);
  };

  const handleGuestNamesChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setGuestNames(file);

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setJsonData(results.data);
        },
      });
    }
    
    setShowGuestList(true);
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

  const handleSubmit = async (event, isSample) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      let resized = document.getElementById("videoPlayer");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!video) {
        setIsLoading(false);
        return toast.error("Please Upload the Video");
      }

      if (!texts) {
        setIsLoading(false);
        return toast.error("Add the Text Box");
      }

      if (!guestNames && !isSample) {
        setIsLoading(false);
        console.log("...........................")
        return toast.error("Please Enter Guest List");
      }

      formData.append("video", video);
      formData.append("guestNames", guestNames);
      formData.append("textProperty", JSON.stringify(texts));
      formData.append("scalingFont", scalingFont);
      formData.append("scalingW", scalingW);
      formData.append("scalingH", scalingH);
      formData.append("isSample", isSample);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/imageEdit?eventId=${eventId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setIsLoading(false);
      setProcessedVideoUrls(response.data.videoUrls);
      setZipUrl(response.data.zipUrl);
      navigate(`/event/mediaGrid?eventId=${eventId}`)
    } catch (error) {
      setIsLoading(false);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="main">
      <ShowSampleModal showGuestList={showGuestList} setShowGuestList={setShowGuestList} data={jsonData} />

      {
        console.log("............", isLoading)
      }

      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-[99]">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">
            Please wait while its Proccessing
          </p>
        </div>
      )}

      <div className="mainContainer">
        {texts.map((val, i) => (
          <TextEditor
            key={i}
            property={val}
            openContextMenuId={openContextMenuId}
            takeTextDetails={takeTextDetails}
          />
        ))}
        <div className="main-wrapper">
          <form className="sidebar">
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
            {/* <button
              type="submit"
              className="custom-file-upload"
              onMouseOver={() => setOnHover3(true)}
              onMouseOut={() => setOnHover3(false)}
            >
              <div className="tooltip" style={{ display: onHover3 && "flex" }}>
                Start Processesing
              </div>
              <FontAwesomeIcon icon={faVideo} />
            </button> */}

            {zipUrl && (
              <label
                className="custom-file-upload"
                onMouseOver={() => setOnHover4(true)}
                onMouseOut={() => setOnHover4(false)}
              >
                <div
                  className="tooltip"
                  style={{ display: onHover4 && "flex" }}
                >
                  Download All Videos in Zip
                </div>
                <a href={zipUrl} download="processed_videos.zip">
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
                    style={{
                      fontSize: video && "15px",
                      padding: video && "8px",
                    }}
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
                      setSelectedText={setSelectedText}
                      selectedText={selectedText}
                    />
                  ))}
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        {video && (
          <SideConfiguration
            texts={texts}
            setTexts={setTexts}
            handleSubmit={handleSubmit}
          />
        )}
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
