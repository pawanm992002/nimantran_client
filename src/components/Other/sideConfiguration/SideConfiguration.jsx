import "./SideConfiguration.css";
import JSZip from "jszip";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

export function SideConfiguration({
  texts,
  setTexts,
  handleSubmit,
  eventId,
  mediaItems,
  savingState,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const deleteText = (id) => {
    setTexts(texts.filter((val) => val.id !== id));
  };

  const hideText = (details) => {
    const others = texts.filter((val) => val.id !== details.id);
    details.hidden = !details.hidden;
    setTexts([...others, details]);
  };

  const downloadFilesAsZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("firebase_files");

      console.log(mediaItems);
      // Loop over each file URL
      for (const item of mediaItems) {
        try {
          const response = await fetch(item.link);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${item.link}`);
          }

          const blob = await response.blob();
          const fileName = decodeURIComponent(
            item?.link?.split("/")?.pop()?.split("?")[0]
          ).replace(`uploads/${eventId}/`, "");

          folder.file(fileName, blob);
        } catch (error) {
          toast.error(`Error downloading ${item.link}: `);
        }
      }

      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Downloadfiles.zip";

        // Append the link to the body and trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      toast.success("Downloading Completed Successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsDownloading(false);
  };

  const handleFinalProcessing = (e) => {
    e.preventDefault();
    handleSubmit(e, false);
  };

  return (
    <div className="configuration">
      {isDownloading && (
        <Loader text={"Please wait while Generating Zip File"} />
      )}
      <h3 className="text-slate-300 italic text-sm px-3 py-1 rounded-lg w-full text-center border-slate-300 border-2">
        {savingState}
      </h3>
      <div className="NoText w-full">
        <button
          type="button"
          className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2 w-full"
          onClick={(e) => handleSubmit(e, true)}
        >
          Show Preview
        </button>

        {
          <a onClick={() => downloadFilesAsZip()}>
            <button className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2 w-full">
              Download Sample's
            </button>
          </a>
        }
        <button
          type="button"
          className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2 w-full"
          onClick={(e) => handleFinalProcessing(e)}
        >
          Start Final Processing
        </button>
      </div>

      <h2>Text Configuration</h2>
      <div className='max-h-56 overflow-auto gap-1 flex flex-col no-scrollbar'>
        {texts.length > 0 ? (
          texts?.map(
            ({
              id,
              text,
              fontColor,
              fontSize,
              duration,
              startTime,
              position,
              fontFamily,
              fontStyle,
              size,
              backgroundColor,
              hidden,
            }) => (
              <div key={id} className="w-full relative bg-slate-50 p-2 rounded-md">
                <div className="flex gap-6 items-center justify-between">
                  <span className="text-[12px] italic whitespace-nowrap">Text Id : {id}</span>
                  <span className="flex gap-3">
                    {hidden ? (
                      <label
                        onClick={() =>
                          hideText({
                            id,
                            text,
                            fontColor,
                            fontSize,
                            duration,
                            startTime,
                            position,
                            fontFamily,
                            fontStyle,
                            size,
                            backgroundColor,
                            hidden,
                          })
                        }
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
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </label>
                    ) : (
                      <label
                        onClick={() =>
                          hideText({
                            id,
                            text,
                            fontColor,
                            fontSize,
                            duration,
                            startTime,
                            position,
                            fontFamily,
                            fontStyle,
                            size,
                            backgroundColor,
                            hidden,
                          })
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      </label>
                    )}
                    <label onClick={() => deleteText(id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </label>
                  </span>
                </div>
              </div>
            )
          )
        ) : (
          <span className="NoText">NO TEXT</span>
        )}
      </div>
    </div>
  );
}

export const EditingTopBar = ({
  handleGuestNamesChange,
  setCountModelOpenNumber,
  setShowGuestList,
  handleVideoUpload,
  createTextDiv,
  comp,
}) => {
  const mediaType = () => {
    if (comp === "Video") return "video/*";
    if (comp === "Image") return "image/*";
    if (comp === "Pdf") return "application/pdf";
  };
  return (
    <form className="sidebar">
      <label
        className="custom-file-upload"
        onChange={handleGuestNamesChange}
        onClick={() => setCountModelOpenNumber(1)}
      >
        <input type="file" accept="text/*" />
        <svg
          // xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm120-160v-80h320v80H320Zm0-120v-80h320v80H320Zm0-120v-80h320v80H320Zm360-80v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
        </svg>
        <span className="text-sm ml-1">Upload Guest List</span>
      </label>

      <label
        className="custom-file-upload"
        onClick={() => setShowGuestList(true)}
      >
        <svg
          // xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z" />
        </svg>
        <span className="text-sm ml-1">Show Guest List</span>
      </label>

      <label
        className="custom-file-upload"
        onChange={(e) => handleVideoUpload(e)}
      >
        <input type="file" accept={mediaType()} />
        <FontAwesomeIcon icon={faFileArrowUp} />
        <span className="text-sm ml-1">Upload {comp}</span>
      </label>

      <label
        type="button"
        className="custom-file-upload"
        onClick={createTextDiv}
      >
        <FontAwesomeIcon icon={faSquarePlus} />
        <span className="text-sm ml-1">Add Text</span>
      </label>
    </form>
  );
};
