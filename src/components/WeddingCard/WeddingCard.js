import React, { useState, useRef, useEffect } from "react";
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
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import SideConfiguration from "../Other/sideConfiguration/SideConfiguration";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextEditor from "../Other/TextEditor/TextEditor";
import ShowSampleModal from "../Other/modal/ShowSampleModal";
import Papa from "papaparse";
import { debounce } from "lodash";

export default function WeddingVideo() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == null || token == null) {
      navigate("/login");
    }
  }, []);
  const [CountModelOpenNumber, setCountModelOpenNumber] = useState(0);
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const parentRef = useRef();
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileObj, setPdfFileObj] = useState(null);
  const [guestNames, setGuestNames] = useState(null);
  const [texts, setTexts] = useState([]);
  const [openContextMenuId, setOpenContextMenuId] = useState(null);
  const [count, setCount] = useState(1);
  const [onHover1, setOnHover1] = useState(false);
  const [onHover2, setOnHover2] = useState(false);
  const [onHover4, setOnHover4] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
  const [showPreview, setShowPreview] = useState(false)
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

  const onDocumentLoad = async ({ doc }) => {
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1 });

    setOriginalSize({
      w: viewport.width,
      h: viewport.height,
    });
  };

  const createTextDiv = () => {
    if (!pdfFile) {
      toast.error("Please First Upload Card in Pdf");
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
      size: { width: 150, height: 80 },
      startTime: 0,
      text: `{name}`,
      backgroundColor: "none",
      hidden: false,
      page: currentPage,

    };
    setCount(count + 1);
    setTexts([...texts, newText]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(URL.createObjectURL(file));
    setPdfFileObj(file);
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

      let resized = document.getElementById("pdfPage");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      if (!pdfFile) {
        setIsLoading(false);
        return toast.error("Please Upload the PDF");
      }

      if (!texts) {
        setIsLoading(false);
        return toast.error("Add the Text Box");
      }

      if (!guestNames && !isSample) {
        setIsLoading(false);
        return toast.error("Please Enter Guest List");
      }

      formData.append("pdf", pdfFileObj);
      // formData.append("guestNames", guestNames);
      formData.append("textProperty", JSON.stringify(texts));
      formData.append("scalingFont", scalingFont);
      formData.append("guestNames", JSON.stringify(jsonData));
      formData.append("scalingW", scalingW);
      formData.append("scalingH", scalingH);
      formData.append("isSample", isSample);
      // formData.append("videoW", parseInt(OriginalSize.w));
      // formData.append("videoH", parseInt(OriginalSize.h));

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdfEdit?eventId=${eventId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsLoading(false);
      if(isSample) {
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

  useEffect(() => {     
    console.log(texts)
    if(texts.length !== 0 ){
    var debouncedFetch = debounce(async () => {
   
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/texts/save?eventId=${eventId}`,
            {texts},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
          console.log(response.data);
        } catch (error) {
          console.error("Error saving texts:", error);
        }
      }, 10000);
        debouncedFetch()
      return () => {
        debouncedFetch.cancel();
      };}
    }, [texts]);
 
    useEffect(() => {

      var getText = async () => {

      try {
        var response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/texts/get?eventId=${eventId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(response.data[0].texts);
        setTexts(response.data[0].texts)
        console.log(texts)
        return response.data[0].texts;
          
        } catch (error) {
          console.error("Error getting texts:", error);
        }
      }
      getText();
      

    }, [])
     
  return (
    <div className="main">
      <ShowSampleModal
        showGuestList={showGuestList}
        setShowGuestList={setShowGuestList}
        data={jsonData}
        CountModelOpenNumber={CountModelOpenNumber}
        Type={"Card"}
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
            {!pdfFile && (
              <label
                className="upload-container"
                onChange={handleFileChange}
                style={{
                  height: pdfFile && "50px",
                  margin: pdfFile && "0 auto",
                  padding: pdfFile && "5px",
                }}
              >
                <input type="file" accept="application/pdf,application/vnd.ms-excel" />
                <div className="upload-content">
                  <h2
                    className="upload-button"
                    style={{
                      fontSize: pdfFile && "15px",
                      padding: pdfFile && "8px",
                    }}
                  >
                    Upload PDF
                  </h2>
                  {!pdfFile && <p>or Drag & Drop a file</p>}
                  {/* <p className="paste-text">paste File or URL</p> */}
                </div>
              </label>
            )}
            <div
              className="videoContainer"
              style={{ display: !pdfFile ? "none" : "flex" }}
            >
              {pdfFile && (
                <div
                  id="mainResized"
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "65vw",
                    maxHeight: "var(--contentMaxHeight)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Worker workerUrl={pdfjsWorker}>
                    <Viewer
                      // defaultScale="PageFit"
                      fileUrl={pdfFile}
                      plugins={[defaultLayoutPluginInstance]}
                      initialPage={currentPage - 1}
                      scrollMode="Page"
                      onPageChange={(e) => setCurrentPage(e.currentPage)}
                      onDocumentLoad={onDocumentLoad}
                      renderPage={(props) => {
                        const {
                          canvasLayer,
                          textLayer,
                          annotationLayer,
                        } = props;
                        return (
                          <div
                            style={{ width: "100%", height: "100%" }}
                            id="pdfPage"
                            ref={parentRef}
                          >
                            {canvasLayer.children}
                            {textLayer.children}
                            {annotationLayer.children}
                            <div
                              style={{ position: "absolute", top: 0, left: 0 }}
                            >
                              {texts?.map(
                                (val) =>
                                  val.page === currentPage && (
                                    <DraggableResizableDiv
                                      openContextMenuId={openContextMenuId}
                                      setOpenContextMenuId={
                                        setOpenContextMenuId
                                      }
                                      key={val?.id}
                                      videoRef={parentRef}
                                      takeTextDetails={takeTextDetails}
                                      property={val}
                                      videoCenter={resized.w / 2}
                                    />
                                  )
                              )}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </Worker>
                </div>
              )}
            </div>
          </div>
        </div>
        {pdfFile && (
          <SideConfiguration
            texts={texts}
            setTexts={setTexts}
            handleSubmit={handleSubmit}
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
                {processedVideoUrls.map((val, i) => (
                  <div key={i} className="min-w-[250px] bg-gray-200 rounded-lg shadow-lg overflow-y-scroll max-h-[460px]">
                    <Worker workerUrl={pdfjsWorker}>
                    <Viewer
                      fileUrl={val.link}
                      scrollMode="Page"
                      // plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
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
