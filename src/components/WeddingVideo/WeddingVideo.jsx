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
import { debounce } from "lodash";

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
  const [CountModelOpenNumber, setCountModelOpenNumber] = useState(0);
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
  const [showPreview, setShowPreview] = useState(false);
  const [videoDuration, setVideoDuration] = useState(1);

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
      text: `{name}`,
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

      // Listen for when the video's metadata has loaded
      videoPlayer.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoPlayer.duration);

        // You can also handle resize here if needed
        setResized({
          w: videoPlayer.clientWidth,
          h: videoPlayer.clientHeight,
        });
        setOriginalSize({
          w: videoPlayer.videoWidth,
          h: videoPlayer.videoHeight,
        });
      });

      // videoPlayer.addEventListener("resize", (ev) => {
      //   // setScaling({
      //   //   width: videoPlayer.videoWidth / videoPlayer.clientWidth,
      //   //   height: videoPlayer.videoHeight / videoPlayer.clientHeight,
      //   // });
      //   setResized({
      //     w: videoPlayer.clientWidth,
      //     h: videoPlayer.clientHeight,
      //   });
      //   setOriginalSize({
      //     w: videoPlayer.videoWidth,
      //     h: videoPlayer.videoHeight,
      //   });
      // });
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
      setIsLoading(true);
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
        return toast.error("Please Enter Guest List");
      }

      formData.append("video", video);
      formData.append("videoDuration", videoDuration);
      formData.append("guestNames", JSON.stringify(jsonData));
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
      if (isSample) {
        setProcessedVideoUrls(response?.data?.videoUrls);
        setZipUrl(response.data.zipUrl);
        setShowPreview(true);
      } else {
        navigate(`/event/mediaGrid?eventId=${eventId}`);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   console.log(texts);
  //   if (texts.length !== 0) {
  //     var debouncedFetch = debounce(async () => {
  //       try {
  //         const response = await axios.post(
  //           `${process.env.REACT_APP_BACKEND_URL}/texts/save?eventId=${eventId}`,
  //           { texts },
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error("Error saving texts:", error);
  //       }
  //     }, 10000);
  //     debouncedFetch();
  //     return () => {
  //       debouncedFetch.cancel();
  //     };
  //   }
  // }, [texts]);

  // useEffect(() => {
  //   var getText = async () => {
  //     try {
  //       var response = await axios.get(
  //         `${process.env.REACT_APP_BACKEND_URL}/texts/get?eventId=${eventId}`,
  //         {},
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       // console.log(response.data[0].texts);
  //       setTexts(response.data[0].texts);
  //       console.log(texts);
  //       return response.data[0].texts;
  //     } catch (error) {
  //       console.error("Error getting texts:", error);
  //     }
  //   };
  //   getText();
  // }, []);

  return (
    <div className="main">
      <ShowSampleModal
        showGuestList={showGuestList}
        setShowGuestList={setShowGuestList}
        data={jsonData}
        CountModelOpenNumber={CountModelOpenNumber}
        Type={"Image"}
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
        {texts.length > 0 && openContextMenuId && (
          <TextEditor
            property={texts
              ?.filter((val) => val.id === openContextMenuId)
              ?.at(0)}
            openContextMenuId={openContextMenuId}
            takeTextDetails={takeTextDetails}
            comp="video"
          />
        )}
        <div className="main-wrapper">
          <form className="sidebar" onSubmit={handleSubmit}>
            <label
              className="custom-file-upload"
              onChange={handleGuestNamesChange}
              onMouseOver={() => setOnHover1(true)}
              onMouseOut={() => setOnHover1(false)}
              onClick={() => setCountModelOpenNumber(1)}
            >
              <div className="tooltip" style={{ display: onHover1 && "flex" }}>
                Upload Guest List
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
                    maxHeight: "var(--contentMaxHeight)",
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

      {showPreview && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 max-w-4xl">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setShowPreview(false)}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Previews</h2>

              {/* Horizontal Scrollable Container */}
              <div className="flex space-x-4 overflow-x-auto p-2">
                {processedVideoUrls.map((val) => (
                  <div
                    key={val}
                    className="w-[250px] bg-gray-200 rounded-lg shadow-lg max-h-[460px]"
                  >
                    <video
                      controls
                      src={val.link}
                      alt={`Video ${val}`}
                      className="rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
