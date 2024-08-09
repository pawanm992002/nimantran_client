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
        <>
          <div className="flex space-x-4 p-4 bg-white shadow-lg rounded-lg">
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.508c-1.91-1.91-4.482-2.958-7.216-2.958-5.639 0-10.222 4.583-10.222 10.222 0 1.805.468 3.58 1.363 5.155l-1.427 5.189 5.331-1.399c1.534.858 3.292 1.307 5.113 1.307 5.639 0 10.222-4.583 10.222-10.222 0-2.734-1.047-5.306-2.958-7.216zm-7.264 15.652c-1.58 0-3.123-.423-4.474-1.226l-.32-.189-3.166.831.848-3.083-.207-.336c-.844-1.373-1.29-2.949-1.29-4.558 0-4.504 3.664-8.168 8.168-8.168 2.182 0 4.232.85 5.777 2.395s2.395 3.595 2.395 5.777c0 4.504-3.664 8.168-8.168 8.168zm4.694-6.211c-.257-.128-1.524-.75-1.761-.836s-.407-.128-.578.128c-.171.256-.664.836-.815 1.007-.149.171-.299.192-.556.064-.257-.127-1.083-.399-2.064-1.272-.764-.68-1.279-1.521-1.428-1.777-.149-.257-.016-.396.112-.523.114-.114.256-.299.384-.448.13-.15.171-.256.257-.427.085-.171.043-.321-.022-.448-.064-.128-.578-1.392-.792-1.907-.206-.492-.417-.425-.578-.433h-.497c-.171 0-.448.064-.685.299-.235.235-.899.878-.899 2.139s.921 2.479 1.05 2.646c.128.171 1.811 2.79 4.389 3.914.614.265 1.09.423 1.461.543.614.195 1.17.167 1.61.102.491-.073 1.524-.625 1.74-1.228.214-.599.214-1.115.149-1.228-.064-.107-.235-.171-.492-.299z" />
              </svg>
              Send to All on WhatsApp
            </button>

            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 11h-4v-1h1c.554 0 1-.446 1-1s-.446-1-1-1h-1v-1h-2v4h4v1h-1c-.554 0-1 .446-1 1v3c0 .554.446 1 1 1h2v-2h-2v-1h2v-3c0-.554-.446-1-1-1zm-4 7h-10v-12h2v-2h-3c-.553 0-1 .447-1 1v14c0 .553.447 1 1 1h11c.553 0 1-.447 1-1v-2h-2v1zm-8-8h2v6h2v-6h2v-2h-6v2z" />
              </svg>
              Download Zip File
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaItems?.guests?.map((media, index) => (
              <div className="relative max-w-60 h-auto m-2" key={index}>
                {mediaItems.editType === "imageEdit" && (
                  <div className="bg-slate-300 min-h-32 h-auto rounded-md w-full p-9 flex items-center pb-4">
                    {media.name} - Your Image is here
                  </div>
                )}

                {mediaItems.editType === "videoEdit" && (
                  <div className="bg-slate-300 min-h-32 h-auto rounded-md w-full p-9 flex items-center pb-4">
                    {media.name} - Your Video is here
                  </div>
                )}
                {/* <video src={media.link} className="w-full h-auto" controls /> */}

                {mediaItems.editType === "cardEdit" && (
                  <div className="bg-slate-300 min-h-32 h-auto rounded-md w-full p-9 flex items-center pb-4">
                    {media.name} - Your PDF is here
                  </div>
                )}
                <div className="absolute inset-0 flex gap-3 justify-end p-1">
                  {/* View Button */}
                  <button
                    onClick={() => handleOpen(media)}
                    className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-8 align-middle p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5"
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
                    className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-8 align-middle p-1"
                    download
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
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
                    className="hover:bg-slate-200 text-[#570000] font-semibold rounded-full h-8 align-middle p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
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
                      alt={selectedMedia.name}
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
        </>
      )}
    </div>
  );
};

export default MediaGrid;
