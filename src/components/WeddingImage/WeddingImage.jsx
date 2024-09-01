import { useState, useRef, useEffect } from "react";
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
import Loader from "../Other/Loader/Loader";

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
  var eventId = params.get("eventId");
  const [jsonData, setJsonData] = useState([
    { name: "pawan mishra", mobileNumber: "1111111111" },
    {
      name: "Dr. Venkatanarasimha Raghavan Srinivasachariyar Iyer",
      mobileNumber: "2222222222",
    },
    {
      name: "Raj",
      mobileNumber: "3333333333",
    },
    {
      name: "Kushagra Nalwaya",
      mobileNumber: "4444444444",
    },
    {
      name: "HARSHIL PAGARIA",
      mobileNumber: "5555555555",
    },
  ]);
  const [video, setVideo] = useState(null);
  const [guestNames, setGuestNames] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [count, setCount] = useState(1);
  const [onHover1, setOnHover1] = useState(false);
  const [onHover2, setOnHover2] = useState(false);
  // const [onHover4, setOnHover4] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestList, setShowGuestList] = useState(true);
  const [CountModelOpenNumber, setCountModelOpenNumber] = useState(0);
  const [processedVideoUrls, setProcessedVideoUrls] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [OriginalSize, setOriginalSize] = useState({
    w: 0,
    h: 0,
  });
  const [resized, setResized] = useState({
    w: 0,
    h: 0,
  });
  // const [zipUrl, setZipUrl] = useState("");

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
      text: `{name}`,
      backgroundColor: "none",
      underline: "none",
      hidden: false,
    };
    setCount(count + 1);
    setTexts([...texts, newText]);
  };

  //  const handleVideoChange = () =>{
  //   const file = event.target.files[0];
  //   setVideo(URL.createObjectURL(file));
  //   setVideoObj(file);
  //  }

  const handleVideoUpload = async (event) => {
    const inputFile = event.target.files[0];
    // const formData = new FormData();
    // formData.append("pawan", inputFile);

    if (inputFile) {
      const videoPlayer = document.getElementById("videoPlayer");
      // const response = await axios.post(
      //   `${process.env.REACT_APP_BACKEND_URL}/texts/image?eventId=${eventId}`,
      //   formData,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      // console.log(response)
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

      const fileURL = URL.createObjectURL(inputFile);
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
    try {
      event.preventDefault();
      setIsLoading(true);

      let resized = document.getElementById("videoPlayer");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!video) {
        setIsLoading(false);
        return toast.error("Please Upload the Video");
      }

      if (texts?.length === 0) {
        setIsLoading(false);
        return toast.error("Add the Text Box");
      }

      if (!guestNames && !isSample) {
        setIsLoading(false);
        return toast.error("Please Enter Guest List");
      }

      if(jsonData?.length <= 0) {
        setIsLoading(false);
        return toast.error("No Guests are Present in CSV");
      }
      
      if(!jsonData[0]?.name || !jsonData[0].mobileNumber) {
        setIsLoading(false);
        return toast.error("name and mobileNumber coloums are required");
      }

      const formData = new FormData();
      formData.append("video", video);
      formData.append("guestNames", JSON.stringify(jsonData));
      formData.append("textProperty", JSON.stringify(texts));
      formData.append("scalingFont", scalingFont);
      formData.append("scalingW", scalingW);
      formData.append("scalingH", scalingH);
      formData.append("isSample", isSample);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${process.env.REACT_APP_BACKEND_URL}/imageEdit?eventId=${eventId}`,
        true
      );
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("Accept", "text/event-stream");

      xhr.onprogress = function () {
        const responseText = xhr.responseText.trim();
        const responses = responseText.split("\n\n"); // SSE events are separated by double newline

        responses.forEach((response) => {
          if (response.startsWith("data: ")) {
            const data = JSON.parse(response.replace("data: ", ""));
            // Update processedVideoUrls ensuring uniqueness by mobileNumber
            setProcessedVideoUrls((prev) => {
              const newList = [...prev];
              const existingIndex = newList.findIndex(
                (item) => item.mobileNumber === data.mobileNumber
              );
              if (existingIndex === -1) {
                newList.push(data);
              } else {
                newList[existingIndex] = data; // Replace existing object if found
              }
              return newList;
            });
          }
        });
      };

      xhr.onerror = function () {
        setIsLoading(false);
        toast.error("Network error!");
      };

      xhr.onloadend = function () {
        if (isSample) {
          setShowPreview(true);
        } else {
          navigate(`/event/mediaGrid?eventId=${eventId}`);
        }
        setIsLoading(false); // Set isLoading to false after the response ends
      };

      xhr.send(formData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsLoading(false);
    }
  };

  // useEffect(() => {
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
        <Loader
          text={`Please wait while its Loading ${processedVideoUrls?.length} / ${jsonData?.length} `}
        />
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
          <form className="sidebar">
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

            {/* {zipUrl && (
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
            )} */}
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
              style={{
                display: !video ? "none" : "flex",
                width: "inherit",
                height: "inherit",
              }}
            >
              {/* <div className="app"> */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "inherit",
                  height: "inherit",
                }}
                ref={videoRef}
              >
                <img
                  style={{
                    backgroundColor: "#000",
                    // maxHeight: "var(--contentMaxHeight)",
                    margin: "0px",
                    objectFit: "contain",
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
                      widthHeight={resized}
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

      {!isLoading && showPreview && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 max-w-4xl">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => {
                setShowPreview(false);
                setProcessedVideoUrls([]);
              }}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>

              {/* Horizontal Scrollable Container */}
              <div className="flex space-x-4 overflow-x-auto p-2">
                {/* Example Cards */}
                {processedVideoUrls.map((val, i) => (
                  <div
                    key={i}
                    className="w-[250px] bg-gray-200 rounded-lg shadow-lg max-h-[460px]"
                  >
                    <img
                      src={val.link}
                      alt={`Image ${val}`}
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