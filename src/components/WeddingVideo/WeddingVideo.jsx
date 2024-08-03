import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./WeddingVideo.css";
import DraggableResizableDiv from "../Other/DraggableResizableDiv/DraggableResizableDiv";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFileArrowUp,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import SideConfiguration from "../Other/sideConfiguration/SideConfiguration";
import ShowSampleModal from "../Other/modal/ShowSampleModal";
import Papa from "papaparse";
import TextEditor from "../Other/TextEditor/TextEditor";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function WeddingVideo() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const videoRef = useRef();

  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const [video, setVideo] = useState(null);
  const [guestNames, setGuestNames] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [count, setCount] = useState(1);
  const [onHover1, setOnHover1] = useState(false);
  const [onHover2, setOnHover2] = useState(false);
  const [onHover4, setOnHover4] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestList, setShowGuestList] = useState(true);
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
      fontWeight: "normal",
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

  // text-1: dc8add, text-2: cdab8f
  console.log("rrrrrrrrrrrrrr", texts);

  const takeTextDetails = (details) => {
    console.log("rrrrrrrrrrrr 2", details);
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

  const handleSubmit = async (event, isSample) => {
    event.preventDefault();
    try {
      setIsLoading(true)
      const formData = new FormData();

      let resized = document.getElementById("videoPlayer");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!video) {
        return toast.error("Please Upload the Video");
      }

      if (!texts) {
        return toast.error("Add the Text Box");
      }

      if (!guestNames && !isSample) {
        return toast.error("Please Enter Guest List");
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
        `${process.env.REACT_APP_BACKEND_URL}/videoEdit?eventId=${eventId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProcessedVideoUrls(response.data.videoUrls);
      setZipUrl(response.data.zipUrl);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
    setIsLoading(false)
    navigate(`/event/mediaGrid?eventId=${eventId}`)
  };
  return (
    <div className="main">
      {/* <h2 className="heading">Wedding Invitation Editor</h2> */}
      <ShowSampleModal
        showGuestList={showGuestList}
        setShowGuestList={setShowGuestList}
        data={jsonData}
      />

      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-[99]">
          <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">
            Please wait while its Proccessing
          </p>
        </div>
      )}
      <div className="mainContainer">
      {openContextMenuId && (
          <TextEditor
            property={texts
              ?.filter((val) => val.id === openContextMenuId)
              ?.at(0)}
            openContextMenuId={openContextMenuId}
            takeTextDetails={takeTextDetails}
          />
        )}
        <div className="main-wrapper">
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
                <a
                  href={zipUrl}
                  download="processed_videos.zip"
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
                    style={{
                      fontSize: video && "15px",
                      padding: video && "8px",
                    }}
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
        </div>
        {video && (
          <SideConfiguration
          handleSubmit={handleSubmit}
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
