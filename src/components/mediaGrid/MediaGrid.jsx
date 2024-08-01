import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
// import './App.css';
// import 'tailwindcss/tailwind.css';

const MediaGrid = () => {
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const eventId = params.get("eventId");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);

  const fetchGuestsMedia = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/events/get-all-guest-media/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMediaItems(data.data)
      
      // setMediaItems([
      //   {
      //     type: "image",
      //     url: "https://via.placeholder.com/150",
      //     alt: "Image 1",
      //   },
      //   {
      //     type: "video",
      //     url: "https://www.w3schools.com/html/mov_bbb.mp4",
      //     alt: "Video 1",
      //   },
      //   {
      //     type: "pdf",
      //     url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      //     alt: "PDF 1",
      //   },
      // ]);
    } catch (error) {
      toast.error("Something went wrong");
    }
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
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaItems?.guests?.map((media, index) => (
          <div className="relative" key={index}>
            {media.imageUrl && (
              <img src={media?.imageUrl} alt={media.alt} className="w-full h-auto" />
            )}
            {media.type === "video" && (
              <video src={media.url} className="w-full h-auto" controls />
            )}
            {media.type === "pdf" && (
              <embed
                src={media.url}
                type="application/pdf"
                className="w-full h-64"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-[#570000] bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex-col gap-3">
              <button
                onClick={() => handleOpen(media)}
                className="px-4 py-2 bg-white text-[#570000] font-semibold rounded w-1/2"
              >
                View
              </button>
              <button
                onClick={() => handleOpen(media)}
                className="px-4 py-2 bg-white text-[#570000] font-semibold rounded w-1/2"
              >
                Download
              </button>
              <button
                onClick={() => handleOpen(media)}
                className="px-4 py-2 bg-white text-[#570000] font-semibold rounded w-1/2"
              >
                Send On Whatsupp
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
              {selectedMedia.imageUrl && (
                <img
                  src={selectedMedia.imageUrl}
                  className="max-h-[80vh] max-w-[80vw]"
                />
              )}
              {selectedMedia.type === "video" && (
                <video
                  src={selectedMedia.url}
                  className="w-full h-auto"
                  controls
                />
              )}
              {selectedMedia.type === "pdf" && (
                <embed
                  src={selectedMedia.url}
                  type="application/pdf"
                  className="w-full h-screen"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGrid;
