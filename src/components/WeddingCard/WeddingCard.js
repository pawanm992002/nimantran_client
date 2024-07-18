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
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { fontFamilies } from "../../App";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import SideConfiguration from "../Other/sideConfiguration/SideConfiguration";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextEditor from "../Other/TextEditor/TextEditor";

export default function WeddingVideo() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(()=>{
     const role = localStorage.getItem('role');
     if(role == null || token == null){
      navigate('/login');
     }
  },[])
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
  const [onHover3, setOnHover3] = useState(false);
  const [onHover4, setOnHover4] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSample, setIsSample] = useState(true);

  // const [scaling, setScaling] = useState({
  //   width: 1,
  //   height: 1,
  // });
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
      text: `Edit Text - ${count}`,
      backgroundColor: "none",
      hidden: false,
      page: currentPage,
      transition: { type: "none", options: null },
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
    setGuestNames(event.target.files[0]);
    // setGuestNames(event.target.value)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      let resized = document.getElementById("pdfPage");
      let scalingW = OriginalSize.w / resized.clientWidth;
      let scalingH = OriginalSize.h / resized.clientHeight;
      let scalingFont = Math.min(scalingW, scalingH);

      console.log(
        texts[0].position.y,
        texts[0].position.y * scalingH,
        scalingH,
        scalingW,
        OriginalSize
      );
      if (!guestNames && !isSample) {
        return toast.error("Please Enter Guest List");
      }
      if (!pdfFile) {
        return toast.error("Please Upload the PDF");
      }

      formData.append("pdf", pdfFileObj);
      formData.append("guestNames", guestNames);
      formData.append("textProperty", JSON.stringify(texts));
      formData.append("scalingFont", scalingFont);
      formData.append("scalingW", scalingW);
      formData.append("scalingH", scalingH);
      formData.append("isSample", isSample);
      // formData.append("videoW", parseInt(OriginalSize.w));
      // formData.append("videoH", parseInt(OriginalSize.h));

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/pdfEdit`,
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
  };
  return (
    <div className="main">
      <h2 className="heading">Wedding Invitation Editor</h2>
      {texts.map((val, i) => (
        <TextEditor
          key={i}
          property={val}
          openContextMenuId={openContextMenuId}
          takeTextDetails={takeTextDetails}
        />
      ))}
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
              <input type="file" accept="pdf/*" />
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
                  width: "70vw",
                  maxHeight: "calc(var(--contentMaxHeight) - 90px)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Worker workerUrl={pdfjsWorker}>
                  <Viewer
                    defaultScale="PageFit"
                    fileUrl={pdfFile}
                    plugins={[defaultLayoutPluginInstance]}
                    initialPage={currentPage - 1}
                    scrollMode="Page"
                    onPageChange={(e) => setCurrentPage(e.currentPage)}
                    onDocumentLoad={onDocumentLoad}
                    renderPage={(props) => {
                      const { canvasLayer, textLayer, annotationLayer, scale } =
                        props;
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
                                    setOpenContextMenuId={setOpenContextMenuId}
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

        {pdfFile && (
          <SideConfiguration
            isSample={isSample}
            setIsSample={setIsSample}
            texts={texts}
            setTexts={setTexts}
          />
        )}
      </div>

      {processedVideoUrls.length > 0 && (
        <h2 className="heading">Processed Cards</h2>
      )}
      {processedVideoUrls.length > 0 && (
        <div className="processed_videos_container">
          {processedVideoUrls.map((url, index) => (
            <div key={index} className="processed_videos">
              <embed src={url} style={{ height: "500px" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
