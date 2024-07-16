// src/components/TextEditor.js

import React, { useState, useEffect } from "react";
import { fontFamilies } from "../../../App";

const TextEditor = ({ takeTextDetails, property, openContextMenuId, comp }) => {
  const [backgroundColor, setBackgroundColor] = useState(
    property.backgroundColor
  );
  // const [text, setText] = useState(property?.text);
  const [selectedTranstion, setSelectedTranstion] = useState(
    property?.transition
  );
  const [fontWeight, setFontWeight] = useState(property?.fontWeight);
  // const [position, setPosition] = useState(property?.position);
  // const [size, setSize] = useState(property?.size);
  const [fontColor, setFontColor] = useState(property?.fontColor);
  const [fontStyle, setFontStyle] = useState(property?.fontStyle);
  const [fontSize, setFontSize] = useState(property?.fontSize);
  const [fontFamily, setFontFamily] = useState(property?.fontFamily);
  const [startTime, setStartTime] = useState(property?.startTime);
  const [duration, setDuration] = useState(property?.duration);
  // const [visible, setVisible] = useState(true);

  useEffect(() => {
    takeTextDetails({
      id: property.id,
      text: property.text,
      position: property.position,
      size: property.size,
      fontColor: fontColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      startTime: startTime,
      duration: duration,
      backgroundColor: backgroundColor,
      transition: selectedTranstion,
      hidden: property.hidden,
      page: property.page,
    });
  }, [
    fontColor,
    fontSize,
    fontWeight,
    startTime,
    duration,
    fontStyle,
    fontFamily,
    backgroundColor,
    // selectedTranstion,
    // property.page,
    // property.hidden,
  ]);

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
    }
  };

  return (
    openContextMenuId === property.id && (
      <div className="flex items-center px-4 py-1 bg-white shadow-md space-x-4 m-2 rounded-md">
        <div>
          <label>
            <select
              className="h-9 outline-none w-32 p-2 rounded-md"
              name="family"
              value={fontFamily}
              onChange={handleStyleChange}
              style={{ fontFamily: fontFamily }}
            >
              {fontFamilies.map((val, i) => (
                <option style={{ fontFamily: val }} value={val} key={i}>
                  {val}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex h-9 rounded-md m-2">
          <input
            className="w-14 outline-none bg-gray-100 p-1 rounded-md"
            type="number"
            name="size"
            value={fontSize}
            onChange={handleStyleChange}
          />
        </div>
        <div className="h-9 flex items-center justify-center bg-gray-100 rounded-md">
          <label
            className="relative text-black font-bold py-2 px-4 rounded h-9"
            htmlFor="fontColor"
          >
            <span
              className="absolute inset-x-0 bottom-0 h-2"
              style={{ background: fontColor }}
            ></span>
            <input
              type="color"
              name="fontColor"
              id="fontColor"
              value={fontColor}
              onChange={handleStyleChange}
              style={{ display: "none" }}
            />
            A
          </label>
        </div>
        <div className="h-9 flex items-center bg-gray-100">
          <input
            className="h-4/5 bg-none"
            type="color"
            name="backgroundColor"
            value={backgroundColor}
            onChange={handleStyleChange}
          />
        </div>
        <div className="h-9 flex items-center">
          <button
            name="weight"
            className={`p-2 border rounded font-bold w-9 m-0 ${
              fontWeight === "bold" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={handleStyleChange}
            value={fontWeight}
          >
            B
          </button>
          <button
            name="style"
            className={`p-2 border rounded italic w-9 ${
              fontStyle === "italic" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            value={fontStyle}
            onClick={handleStyleChange}
          >
            I
          </button>
        </div>
        <button className="p-2 border rounded" title="Text Effects">
          Transition
        </button>

        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-100 rounded-md">
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
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>

            <input
              className="w-14 bg-gray-100 outline-none p-1 rounded-md"
              type="number"
              name="startTime"
              step="0.1"
              value={startTime}
              onChange={handleStyleChange}
            />
          </div>
        )}
        {comp === "video" && (
          <div className="h-9 flex items-center bg-gray-100 rounded-md">
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
                d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <input
              className="w-14 outline-none bg-gray-100 p-1 rounded-md"
              type="number"
              name="duration"
              step="0.1"
              value={duration}
              onChange={handleStyleChange}
            />
          </div>
        )}
        {/* <button className="p-2 border rounded" title="Animate">
          Animate
        </button> */}
      </div>
    )
  );
};

export default TextEditor;
