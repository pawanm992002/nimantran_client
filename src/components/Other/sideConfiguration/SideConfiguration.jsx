import React from "react";
import "./SideConfiguration.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
export default function SideConfiguration({
  texts,
  setTexts,
  handleSubmit,
  zipUrl,
  type,
}) {
  const deleteText = (id) => {
    setTexts(texts.filter((val) => val.id !== id));
  };

  const hideText = (details) => {
    const others = texts.filter((val) => val.id !== details.id);
    details.hidden = !details.hidden;
    setTexts([...others, details]);
  };

  const handleFinalProcessing = (e) => {
    e.preventDefault();
    handleSubmit(e, false);
  };

  return (
    <div className="configuration">
      <div className="NoText">
        <button
          type="button"
          className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2"
          onClick={(e) => handleSubmit(e, true)}
        >
          Show Preview
        </button>

        {zipUrl !== "" && (
          <a href={zipUrl} download={`processed_${type}.zip`} className="">
            <button className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2">
              Download {type} files
              <FontAwesomeIcon icon={faFileArrowDown} />
            </button>
          </a>
        )}
        <button
          type="button"
          className="bg-slate-50 rounded-md m-1 text-[#570000] hover:bg-[#c44141] font-bold text-sm p-2"
          onClick={(e) => handleFinalProcessing(e)}
        >
          Start Final Processing
        </button>
      </div>

      <h2>Text Configuration</h2>
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
            <div key={id} className="context-menu relative">
              <div className="flex gap-8 items-center justify-between">
                <span className="text-sm">Text Id : {id}</span>
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
                        className="size-5"
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
                      className="size-5"
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
  );
}
