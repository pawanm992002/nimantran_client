import { useEffect, useState } from "react";
// import { Worker, Viewer } from "pdfjs-dist";
import axios from "axios";
import { Toaster } from "react-hot-toast";
const Model = ({ handleClose, mediaItems = "imageEdit" }) => {
  const close = () => {
    handleClose();
  };

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

const InvitationTracker = () => {
  const [OpenModel, setOpenModel] = useState(false);
  const handleClose = () => {
    setOpenModel(false);
  };
  const [data, setdata] = useState([
    { number: "7978984387", name: "Ravi", status: "Completed" },
    { number: "8978984387", name: "Raju", status: "Pending" },
    { number: "9978984387", name: "Rajan", status: "Failed" },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get()
        .then((res) => {
          console.log(res.data);
          if (!res.data.length === 0) {
            setdata(res.data);
          } else {
            Toaster("No Data Found", {
              icon: "⚠️",
            });
            setdata([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const handleFiltersStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  console.log(selectedStatus);
  const filteredData =
    selectedStatus === "All"
      ? data
      : data.filter((item) => item.status === selectedStatus);

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
                className="border px-4 py-1  box-border rounded-md"
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
              </select>
            </th>
            <th className="border px-4 py-2 box-border">Preview</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 box-border">{row.name}</td>
              <td className="border px-4 py-2 box-border">{row.number}</td>

              <td className="border px-4 py-2 box-border">{row.status}</td>
              <td className="border px-4 py-2 box-border">
                <button
                  className="bg-gray-500 px-4 rounded-sm py-0.5 text-gray-100"
                  onClick={() => setOpenModel(true)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {OpenModel && <Model handleClose={handleClose} />}
    </div>
  );
};

export default InvitationTracker;
