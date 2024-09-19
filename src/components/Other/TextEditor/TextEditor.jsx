import React, { useState, useEffect, useRef } from "react";
import { fontFamilies } from "../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faCircleChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const DropDownMenu = ({ fontFamilies, select, setSelectedFont }) => {
  const [toggleState, settoggleState] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        settoggleState(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className=""
      onClick={() => settoggleState(!toggleState)}
      ref={dropdownRef}
    >
      <div className="bg-gray-200 px-2 rounded-md flex  gap-x-2 justify-between w-max cursor-pointer">
        <div style={{ fontFamily: select }}>{select}</div>
        <div>
          <FontAwesomeIcon
            icon={faCircleChevronDown}
            className={`${
              toggleState ? "rotate-180" : ""
            } transition-all duration-300`}
          />
        </div>
      </div>

      <div
        className={`bg-gray-200 py-1 px-2 rounded-md flex  gap-x-2 justify-between absolute z-50 mt-2 ${
          toggleState ? "visible" : "hidden"
        }  transition-all duration-300`}
      >
        <ul className="bg-gray-200 px-2 max-h-96 overflow-y-scroll rounded-b-md gap-y-1">
          {fontFamilies.map((fontFamily) => (
            <li
              key={fontFamily}
              className="bg-gray-200 cursor-pointer "
              style={{ fontFamily: fontFamily }}
              onClick={() => setSelectedFont(fontFamily)}
            >
              {fontFamily}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TextEditor = ({
  takeTextDetails,
  property,
  openContextMenuId,
  comp,
  videoDuration,
}) => {
  const [backgroundColor, setBackgroundColor] = useState(
    property?.backgroundColor
  );
  const [selectedTransition, setSelectedTransition] = useState(
    property?.transition
  );
  const [fontWeight, setFontWeight] = useState(property?.fontWeight);
  const [underline, setUnderline] = useState(property?.underline);
  const [fontColor, setFontColor] = useState(property?.fontColor);
  const [fontStyle, setFontStyle] = useState(property?.fontStyle);
  const [fontSize, setFontSize] = useState(property?.fontSize);
  const [fontFamily, setFontFamily] = useState(property?.fontFamily);
  const [startTime, setStartTime] = useState(property?.startTime);
  const [duration, setDuration] = useState(property?.duration);

  useEffect(() => {
    takeTextDetails({
      id: property?.id,
      text: property?.text,
      position: property?.position,
      size: property?.size,
      fontColor: fontColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      underline: underline,
      fontStyle: fontStyle,
      startTime: startTime,
      duration: duration,
      backgroundColor: backgroundColor,
      transition: selectedTransition,
      hidden: property?.hidden,
      page: property?.page,
    });
  }, [
    fontColor,
    fontSize,
    fontWeight,
    underline,
    startTime,
    duration,
    fontStyle,
    fontFamily,
    backgroundColor,
    selectedTransition?.type,
    selectedTransition?.options?.duration,
  ]);

  useEffect(() => {
    setSelectedTransition(property?.transition);
    setBackgroundColor(property?.backgroundColor);
    setFontSize(property?.fontSize);
    setFontColor(property?.fontColor);
    setFontWeight(property?.fontWeight);
    setUnderline(property?.underline);
    setFontStyle(property?.fontStyle);
    setFontFamily(property?.fontFamily);
    setStartTime(property?.startTime);
    setDuration(property?.duration);
  }, [openContextMenuId]);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fontColor") {
      setFontColor(value);
    } else if (name === "style") {
      setFontStyle(value === "italic" ? "normal" : "italic");
    } else if (name === "size") {
      setFontSize(parseInt(value, 10));
    } else if (name === "family") {
      setFontFamily(value);
    } else if (name === "weight") {
      setFontWeight(value === "bold" ? "normal" : "bold");
    } else if (name === "startTime") {
      setStartTime(parseFloat(value));
    } else if (name === "duration") {
      setDuration(parseFloat(value));
    } else if (name === "backgroundColor") {
      setBackgroundColor(value);
    } else if (name === "underline") {
      setUnderline(value === "underline" ? "none" : "underline");
    }
    // else if (name === "transition") {
    //   setSelectedTransition(JSON.parse(value));
    // }
  };

  const transitionArray = [
    {
      type: "none",
      name: "Select Transition",
      options: null,
    },
    {
      type: "move_up",
      name: "Move Up",
      options: {
        top: 50,
        duration: 3,
      },
    },
    {
      type: "move_down",
      name: "Move Down",
      options: {
        bottom: 100,
        duration: 1,
      },
    },
    {
      type: "move_right",
      name: "Move Right",
      options: {
        right: 50,
        duration: 1,
      },
    },
    {
      type: "move_left",
      name: "Move Left",
      options: {
        left: 50,
        duration: 1,
      },
    },
    {
      type: "path_cover",
      name: "Rotate",
      options: {
        rotationSpeed: 0.4,
        duration: 1,
        clockwise: false,
      },
    },
    {
      type: "fade",
      name: "Fade",
      options: {
        duration: 2,
      },
    },
    {
      type: "zoom_in",
      name: "Zoom In",
      options: {
        scale: 2,
      },
    },
    {
      type: "zoom_out",
      name: "Zoom Out",
      options: {
        scale: 2,
      },
    },
  ];

  return (
    openContextMenuId === property?.id && (
      <div className="flex items-center pb-2 px-1 bg-white shadow-md space-x-2 m-2 mb-0 rounded-md h-[35px]">
        <DropDownMenu
          fontFamilies={fontFamilies}
          select={fontFamily}
          setSelectedFont={setFontFamily}
        />
        <div className="flex rounded-md m-2">
          <input min={5}
            className="w-14 outline-none bg-gray-200 p-1 rounded-md"
            type="number"
            name="size"
            value={fontSize}
            onChange={handleStyleChange}
            title="Set font size"
          />
        </div>
        <div className="h-9 flex items-center justify-center bg-gray-200 rounded-md">
          <label
            className="relative text-black font-extrabold rounded h-9 text-2xl min-w-8 flex justify-center items-center"
            htmlFor="fontColor"
            style={{ color: fontColor }}
          >
            A
          </label>
          <input
            type="color"
            name="fontColor"
            id="fontColor"
            value={fontColor}
            onChange={handleStyleChange}
            style={{ visibility: "hidden", width: 0, height: 0, display: 'none' }}
          />
        </div>
        <div className="h-9 flex items-center bg-gray-200">
          <label
            className="relative text-black font-extrabold rounded h-9 text-2xl min-w-8 flex justify-center items-center"
            htmlFor="backgroundColor"
            style={{
              color: backgroundColor === "none" ? "black" : backgroundColor,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M16.098 2.598a3.75 3.75 0 1 1 3.622 6.275l-1.72.46V12a.75.75 0 0 1-.22.53l-.75.75a.75.75 0 0 1-1.06 0l-.97-.97-7.94 7.94a2.56 2.56 0 0 1-1.81.75 1.06 1.06 0 0 0-.75.31l-.97.97a.75.75 0 0 1-1.06 0l-.75-.75a.75.75 0 0 1 0-1.06l.97-.97a1.06 1.06 0 0 0 .31-.75c0-.68.27-1.33.75-1.81L11.69 9l-.97-.97a.75.75 0 0 1 0-1.06l.75-.75A.75.75 0 0 1 12 6h2.666l.461-1.72c.165-.617.49-1.2.971-1.682Zm-3.348 7.463L4.81 18a1.06 1.06 0 0 0-.31.75c0 .318-.06.63-.172.922a2.56 2.56 0 0 1 .922-.172c.281 0 .551-.112.75-.31l7.94-7.94-1.19-1.19Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <input
            id="backgroundColor"
            className="h-4/5 bg-none"
            type="color"
            name="backgroundColor"
            value={backgroundColor}
            onChange={handleStyleChange}
            title="Set background color"
            style={{ visibility: "hidden", width: 0, height: 0, display: 'none' }}
          />
          {/* <div> */}
          <button
            className="bg-white border rounded-md size-8 h-full"
            name="reset"
            onClick={() => setBackgroundColor("none")}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          {/* </div> */}
        </div>
        <div className="h-9 flex items-center gap-x-1">
          <button
            name="weight"
            className={`p-2 border rounded font-bold w-8 h-full m-0 ${
              fontWeight === "bold" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={handleStyleChange}
            value={fontWeight}
            title="Toggle bold"
          >
            B
          </button>
          <button
            name="style"
            className={`p-2 border h-full rounded italic w-8 ${
              fontStyle === "italic" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            value={fontStyle}
            onClick={handleStyleChange}
            title="Toggle italic"
          >
            I
          </button>
          <button
            name="underline"
            className={`p-2 border rounded w-8 h-full m-0 ${
              underline === "underline"
                ? "underline  bg-blue-500 text-white"
                : "bg-white"
            }`}
            onClick={handleStyleChange}
            value={underline}
            title="Underline Text"
          >
            U
          </button>
        </div>

        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-200 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              title="Start time"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>

            <input
              className="w-14 bg-gray-200 outline-none p-1 rounded-md"
              type="number"
              name="startTime"
              step="0.1"
              value={startTime}
              onChange={handleStyleChange}
              min="0"
              max={duration - 0.1}
              title="Set start time"
            />
          </div>
        )}
        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-200 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              title="Duration"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <input
              className="w-14 outline-none bg-gray-200 p-1 rounded-md"
              type="number"
              name="duration"
              step="0.1"
              value={duration}
              onChange={handleStyleChange}
              title="Set duration"
              min={startTime + 0.1}
              max={videoDuration}
            />
          </div>
        )}

        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-200 rounded-md">
            <select
              className="h-9 outline-none p-2 rounded-md w-full"
              name="transition"
              // defaultValue={JSON.stringify(property.transition)}
              value={selectedTransition.type}
              onChange={(e) =>
                setSelectedTransition((prev) => {
                  prev.type = e.target.value;
                  return { ...prev };
                })
              }
              title="Select transition"
            >
              {transitionArray.map((transition, i) => (
                <option value={transition.type} key={i}>
                  {transition.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-200 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z"
                clipRule="evenodd"
              />
            </svg>

            <input
              className="w-14 outline-none bg-gray-200 p-1 rounded-md"
              type="number"
              step="0.1"
              min="0.1"
              value={selectedTransition?.options?.duration}
              onChange={(e) =>
                setSelectedTransition((prev) => {
                  prev.options.duration = parseFloat(e.target.value);
                  return { ...prev };
                })
              }
              title="Transition On Enter"
            />
          </div>
        )}
      </div>
    )
  );
};

export default TextEditor;
