// DraggableResizableDiv.js
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./DraggableResizableDiv.css";

const DraggableResizableDiv = ({
  videoRef,
  takeTextDetails,
  property,
  openContextMenuId,
  setOpenContextMenuId,
  videoCenter,
  comp,
  widthHeight,
}) => {
  const [text, setText] = useState(property?.text);
  const [position, setPosition] = useState(property?.position);
  const [size, setSize] = useState(property?.size);
  const [visible, setVisible] = useState(true);
  const [isAtCenter, setIsAtCenter] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const handleDrag = (e, data) => {
    if (data.x >= 0 && data.y >= 0) {
      setPosition({ x: data.x, y: data.y });
    }
    // if (data.y >= widthHeight.h - property?.size?.height) {
    //   setPosition({ x: widthHeight.w / 2, y: widthHeight.h / 2 });
    // }
    // if (data.x >= widthHeight.w - property?.size?.width) {
    //   setPosition({ x: widthHeight.w / 2, y: widthHeight.h / 2 });
    // }
    if (Math.abs(videoCenter - size?.width / 2 - data.x) < 2) {
      setIsAtCenter(true);
    } else {
      setIsAtCenter(false);
    }
    const a = setTimeout(() => {
      setIsAtCenter(false);
    }, 3000);
  };

  const handleResize = (e, { size }) => {
    setSize({ width: size?.width, height: size?.height });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setOpenContextMenuId(property?.id);
  };

  useEffect(() => {
    takeTextDetails({
      id: property?.id,
      text,
      position,
      size,
      fontColor: property.fontColor,
      fontWeight: property.fontWeight,
      underline: property.underline,
      fontSize: property.fontSize,
      fontFamily: property.fontFamily,
      fontStyle: property.fontStyle,
      startTime: property.startTime,
      duration: property.duration,
      backgroundColor: property.backgroundColor,
      transition: property.transition,
      hidden: property.hidden,
      page: property.page,
    });
  }, [
    position,
    size,
    text,
    property.page,
    property.hidden,
  ]);

  useEffect(() => {
    // try {
    const checkVisibility = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        setVisible(
          currentTime >= property.startTime && currentTime <= property.duration
        );
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", checkVisibility);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", checkVisibility);
      }
    };
    // } catch (error) {}
  }, [property.startTime, property.duration, videoRef]);

  return (
    <Draggable
      key={property.id}
      handle=".handle"
      onDrag={handleDrag}
      position={position}
    >
      <div
        className="draggable-container"
        onClick={handleContextMenu}
        style={{
          zIndex: openContextMenuId === property.id ? 40 : 1,
          display: property.hidden ? "none" : "inline-block",
        }}
      >
        {/* <div
          className="handle"
          style={{
            cursor: "move",
            background: "black",
            // padding: "5px",
            borderBottom: "1px solid #ccc",
            fontSize: "12px",
            height: "4px",
            width: "100%",
          }}
        ></div> */}
        <ResizableBox
          width={size?.width}
          height={size?.height}
          minConstraints={[100, 40]}
          // maxConstraints={[400, 250]}
          onResizeStop={handleResize}
          className="resizable-box  handle"
        >
          <div
            className="editable-box"
            style={{
              display: visible ? "flex" : "none",
              background: `${property.backgroundColor}`,
            }}
          >
            <input
              type="text"
              style={{
                color: property.fontColor,
                fontStyle: property.fontStyle,
                fontSize: `${property.fontSize}px`,
                fontFamily: property.fontFamily,
                display: visible ? "flex" : "none",
                fontWeight: property.fontWeight,
                textDecoration: property.underline
              }}
              className="textInput"
              placeholder="Write Text..."
              value={text}
              readOnly={!isActive}
              onDoubleClick={() => setIsActive(!isActive)}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </ResizableBox>
        {isAtCenter && (
          <div
            className="dotted-center-line"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "1px",
              backgroundColor: "black",
              zIndex: 30,
            }}
          />
        )}
      </div>
    </Draggable>
  );
};

export default DraggableResizableDiv;
