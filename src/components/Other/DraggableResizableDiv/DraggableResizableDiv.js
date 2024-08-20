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
}) => {
  const [text, setText] = useState(property?.text);
  const [selectedTranstion, setSelectedTranstion] = useState(
    property?.transition
  );
  const [position, setPosition] = useState(property?.position);
  const [size, setSize] = useState(property?.size);
  const [visible, setVisible] = useState(true);
  const [isAtCenter, setIsAtCenter] = useState(false);

  const changeTransition = (e, dif) => {
    let obj = {
      type: "slide",
      options: {
        left: selectedTranstion?.options?.left,
        right: selectedTranstion?.options?.right,
        top: selectedTranstion?.options?.top,
        bottom: selectedTranstion?.options?.bottom,
        duration: selectedTranstion?.options?.duration,
      },
    };
    obj.options[dif] = parseInt(e.target.value);
    setSelectedTranstion(obj);
  };
  const handleDrag = (e, data) => {
    if(data.x >= 0 && data.y >= 0) {
      setPosition({ x: data.x, y: data.y });
    }
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
      fontSize: property.fontSize,
      fontFamily: property.fontFamily,
      fontStyle: property.fontStyle,
      startTime: property.startTime,
      duration: property.duration,
      backgroundColor: property.backgroundColor,
      transition: selectedTranstion,
      hidden: property.hidden,
      page: property.page,
    });
  }, [
    position,
    size,
    text,
    selectedTranstion,
    property.page,
    property.hidden,
    property.backgroundColor,
    property.fontWeight,
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
        <div
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
        ></div>
        <ResizableBox
          width={size?.width}
          height={size?.height}
          minConstraints={[100, 40]}
          maxConstraints={[400, 250]}
          onResizeStop={handleResize}
          className="resizable-box"
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
              }}
              className="textInput"
              placeholder="Write Text..."
              value={text}
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
