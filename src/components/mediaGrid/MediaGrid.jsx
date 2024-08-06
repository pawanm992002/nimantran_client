import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Loader from "../Other/Loader/Loader";

const MediaGrid = () => {
  const token = localStorage.getItem("token");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const individualWhatsuppInvite = async (guest) => {
    try {
      console.log("me", guest);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/whatsapp/individual?eventId=${eventId}`,
        guest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {}
  };

  const fetchGuestsMedia = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/get-all-guest-media/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMediaItems(data.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGuestsMedia();
  }, []);
  const handleOpen = (media) => {
    setSelectedMedia(media);
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  useEffect(() => {}, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loader text="Please wait while its Loading" />
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems?.guests?.map((media, index) => (
            <div className="relative max-w-60 h-auto m-2" key={index}>
              {mediaItems.editType === "imageEdit" && (
                <div className="bg-slate-300 min-h-32 h-auto rounded-md w-full p-9 flex items-center pb-4">
                  {media.name} - Your Image is here
                </div>
                // <img
                //   src={media?.link}
                //   alt={media.alt}
                //   className="w-full h-auto"
                // />
              )}
              {mediaItems.editType === "videoEdit" && (
                <video src={media.link} className="w-full h-auto" controls />
              )}

              {mediaItems.editType === "cardEdit" && (
                <div className="bg-slate-300 min-h-32 h-auto rounded-md w-full p-9 flex items-center pb-4">
                  {media.name} - Your PDF is here
                </div>
              )}
              <div className="absolute inset-0 flex gap-3 justify-end p-2">
                {/* View Button */}
                <button
                  onClick={() => handleOpen(media)}
                  className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-10 align-middle p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>
                {/* Download Button */}
                <a
                  href={media.link}
                  className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-10 align-middle p-2"
                  download
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </a>
                {/* send to Whatsupp button */}
                <button
                  onClick={() => individualWhatsuppInvite(media)}
                  className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-10 align-middle p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {selectedMedia && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="bg-white p-4 rounded-lg">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-black bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center w-8 h-8"
                >
                  &times;
                </button>
                {mediaItems.editType === "imageEdit" && (
                  <img
                    src={selectedMedia.link}
                    className="max-h-[80vh] max-w-[80vw]"
                  />
                )}
                {mediaItems.editType === "videoEdit" && (
                  <video
                    src={selectedMedia.link}
                    className="w-full h-auto"
                    controls
                  />
                )}
                {mediaItems.editType === "cardEdit" && (
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "60vw",
                      maxHeight: "500px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Worker workerUrl={pdfjsWorker}>
                      <Viewer
                        fileUrl={selectedMedia.link}
                        plugins={[defaultLayoutPluginInstance]}
                        scrollMode="Page"
                        renderPage={(props) => {
                          const { canvasLayer, textLayer, annotationLayer } =
                            props;
                          return (
                            <div
                              style={{ width: "500px", height: "500px" }}
                              id="pdfPage"
                            >
                              {canvasLayer.children}
                              {textLayer.children}
                              {annotationLayer.children}
                            </div>
                          );
                        }}
                      />
                    </Worker>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
