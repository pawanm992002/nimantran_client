import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Model = ({ handleClose, mediaItems = "imageEdit", media }) => {
  const close = () => {
    handleClose();
  };
  console.log(media)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-black bg-gray-200 hover:bg-gray-300 rounded-full flex justify-center items-center w-8 h-8"
        >
          &times;
        </button>
        {mediaItems.editType === "imageEdit" && (
          <img
            // src={selectedMedia?.link}
            className="max-h-[80vh] max-w-[80vw]"
            alt="Selected media"
          />
        )}
        {mediaItems.editType === "videoEdit" && (
          <video
            // src={selectedMedia.link}
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
            }}
          >
            {/* <Worker workerUrl={pdfjsWorker}>
                            <Viewer
                                fileUrl={selectedMedia.link}
                                plugins={[defaultLayoutPluginInstance]}
                                scrollMode="Page"
                                renderPage={(props) => {
                                    const { canvasLayer, textLayer, annotationLayer } = props;
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
                        </Worker> */}
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonLoader = () => {
  return (
    <tr>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
      </td>
      <td className="border px-4 py-2 box-border">
        <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
      </td>
    </tr>
  );
};

const InvitationTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [OpenModel, setOpenModel] = useState(false);
  const handleClose = () => {
    setOpenModel(false);
  };
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/whatsapp/all?eventId=${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const transformedData = response.data.data.flatMap((item) => {
        if (item.sid.length === 0) {
          // If sid is empty, add "none" for status and time
          return [
            {
              name: item.name,
              mobileNumber: item.mobileNumber,
              status: "not sent",
              time: "-",
              link: item.link,
            },
          ];
        } else {
          return item.sid.map((sidItem) => {
            const dateCreated = new Date(sidItem.dateCreated);
            const formattedTime = `${
              dateCreated.getHours() % 12 || 12
            }:${String(dateCreated.getMinutes()).padStart(2, "0")} ${
              dateCreated.getHours() >= 12 ? "PM" : "AM"
            }`;
            const formattedDate = `${String(dateCreated.getDate()).padStart(
              2,
              "0"
            )}/${String(dateCreated.getMonth() + 1).padStart(2, "0")}/${String(
              dateCreated.getFullYear() % 100
            ).padStart(2, "0")}`;

            return {
              name: item.name,
              mobileNumber: item.mobileNumber,
              status: sidItem.status,
              time: `${formattedTime} ${formattedDate}`,
              link: item.link,
            };
          });
        }
      });

      setData(transformedData);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const filteredData =
    selectedStatus === "All"
      ? data
      : data.filter((item) => item.status === selectedStatus.toLowerCase());
  const [Media, setMedia] = useState();
  const handleViewClick = (mediaLink) => {
    setMedia(mediaLink);

    setOpenModel(true);
  };
  return (
    <div className="container mx-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 text-gray-600 text-left">
          <tr>
            <th className="border px-4 py-2 box-border">Name</th>
            <th className="border px-4 py-2 box-border">Number</th>
            <th className="border px-4 py-2 box-border">
              <label>Status : </label>
              <select
                className="border px-4 py-1  box-border rounded-md "
                onChange={(e) => handleFiltersStatusChange(e)}
              >
                <option value="All">All</option>
                <option value="Completed" className="text-green-500">
                  Completed
                </option>
                <option value="Pending" className="text-yellow-500">
                  Pending
                </option>
                <option value="Failed" className="text-red-500">
                  Failed
                </option>
                <option value="Not Sent" className="text-gray-500">
                  Not Sent
                </option>
              </select>
            </th>
            <th className="border px-4 py-2 box-border">Time</th>
            <th className="border px-4 py-2 box-border">Preview</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            filteredData?.map((row, index) => (
              <tr key={index}>
                <td className="border px-4 py-2 box-border">{row?.name}</td>
                <td className="border px-4 py-2 box-border">
                  {row?.mobileNumber}
                </td>
                <td className="border px-4 py-2 box-border">{row?.status}</td>
                <td className="border px-4 py-2 box-border">{row?.time}</td>
                <td className="border px-4 py-2 box-border">
                  <button
                    className="bg-gray-500 px-4 rounded-sm py-0.5 text-gray-100"
                    onClick={() => handleViewClick(row.link)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {OpenModel && <Model handleClose={handleClose} media={Media} />}
    </div>
  );
};

export default InvitationTracker;
