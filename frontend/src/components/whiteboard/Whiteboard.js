import React, { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

export default function Whiteboard({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    tool,
    color,
    user,
    socket,
}) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [img, setImg] = useState(null);

    useEffect(() => {
        socket.on("whiteBoardDataResponse", (data) => {
            if (data && data.imgURL) {
                setImg(data.imgURL);
            }
        });
    }, [socket]);


    useEffect(() => {
        if (canvasRef.current) {
            console.log("useEffect1: ", canvasRef);
            console.log("useEffect1: ", canvasRef.current);
            const canvas = canvasRef.current;
            canvas.height = window.innerHeight * 2;
            canvas.width = window.innerWidth * 2;
            const ctx = canvas.getContext("2d");

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";

            ctxRef.current = ctx;
        }
    }, [canvasRef, color, ctxRef]);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = color;
        }
    }, [color, ctxRef]);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            const roughCanvas = rough.canvas(canvasRef.current);
    
            if (elements.length > 0) {
                ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
    
            elements.forEach((element) => {
                if (element.type === "rect") {
                    roughCanvas.draw(
                        roughGenerator.rectangle(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.height,
                            {
                                stroke: element.stroke,
                                strokeWidth: 5,
                                roughness: 0,
                            }
                        )
                    );
                } else if (element.type === "pencil") {
                    roughCanvas.linearPath(element.path, {
                        stroke: element.stroke,
                        strokeWidth: 5,
                        roughness: 0,
                    });
                } else if (element.type === "line") {
                    roughCanvas.draw(
                        roughGenerator.line(
                            element.offsetX,
                            element.offsetY,
                            element.width,
                            element.height,
                            {
                                stroke: element.stroke,
                                strokeWidth: 5,
                                roughness: 0,
                            }
                        )
                    );
                }
            });
    
            // Create a new canvas with the desired dimensions
            const newCanvas = document.createElement("canvas");
            const newContext = newCanvas.getContext("2d");
            newCanvas.width = "285%"; // Set your desired width here
            newCanvas.height = window.innerHeight; // Set your desired height here
    
            // Draw the original canvas onto the new canvas
            newContext.drawImage(canvasRef.current, 0, 0, newCanvas.width, newCanvas.height);
    
            // Get the data URL from the new canvas
            const canvasImage = newCanvas.toDataURL();
            console.log("Canvas Image URL:", canvasImage);
            socket.emit("whiteBoardData", canvasImage);
        }
    }, [elements, canvasRef, ctxRef, socket]);
    

    if (user && !user.presenter) {
        return (
            <div className="border border-dark b-2 h-100 w-100 overflow-hidden">
                <img
                    src={img}
                    alt="whiteboard img shared by presenter"
                    // className="w-100 h-100"
                    style={{
                        height: window.innerHeight*2,
                        width: "285%"
                    }}
                />
            </div>
        );
    }

    const handleMouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ]);
        } else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        } else if (tool === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rect",
                    offsetX,
                    offsetY,
                    width: 0,
                    height: 0,
                    stroke: color,
                },
            ]);
        }

        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        if (isDrawing) {
            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newPath,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "rect") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX - ele.offsetX,
                                height: offsetY - ele.offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handleMouseUp = (e) => {
        setIsDrawing(false);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-dark b-2 h-100 w-100 overflow-hidden"
        >
            <canvas ref={canvasRef} />
        </div>
    );
}
