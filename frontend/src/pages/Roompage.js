import React, { useEffect, useRef, useState } from "react";
import Whiteboard from "../components/whiteboard/Whiteboard";
import Chat from "../components/Chat/Chat";

export default function Roompage({ user, socket, users }) {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("black");
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([]);
    const [openedUserTab, setOpenedUserTab] = useState(false);
    const [openedChatTab, setOpenedChatTab] = useState(false);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillRect = "white";
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([]);
    };

    const handleUndo = () => {
        setHistory((prevHistory) => [
            ...prevHistory,
            elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
            prevElements.slice(0, prevElements.length - 1)
        );
    };

    const handleRedo = () => {
        setElements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]);
        setHistory((prevHistory) =>
            prevHistory.slice(0, prevHistory.length - 1)
        );
    };

    return (
        <div className="h-screen w-100 row">
            <button
                type="button"
                className="btn btn-dark"
                onClick={()=>setOpenedUserTab(true)}
                style={{
                    display: "block",
                    position: "absolute",
                    top: "3%",
                    left: "3%",
                    height: "40px",
                    width: "80px",
                }}
            >
                Users
            </button>

            <button
                type="button"
                className="btn btn-primary"
                onClick={()=>setOpenedChatTab(true)}
                style={{
                    display: "block",
                    position: "absolute",
                    top: "3%",
                    left: "10%",
                    height: "40px",
                    width: "80px",
                }}
            >
                Chat
            </button>

            {openedUserTab && (
                <div
                    className="position-fixed top-0 left-0 h-100 text-white bg-primary"
                    style={{ width: "200px", left: "0%" }}
                >
                    <button
                        type="button"
                        onClick={() => setOpenedUserTab(false)}
                        className="btn btn-light btn-block"
                        style={{
                            display: "block",
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            height: "40px",
                            width: "80px",
                        }}
                    >
                        Close
                    </button>

                    <div className="w-100 mt-5 pt-5">
                        {users.map((usr, index) => (
                            <p
                                key={index * 999}
                                className="my-2 text-center w-100"
                            >
                                {usr.name}{" "}
                                {user && user.userId === usr.userId && "(You)"}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {
                openedChatTab && (
                    <Chat setOpenedChatTab={setOpenedChatTab} socket={socket}/>
                )
            }

            <h3 className="text-center pt-4">
                White Board Sharing App{" "}
                <span className="text-primary">
                    [Users Online: {users.length}]
                </span>
            </h3>

            {user?.presenter && (
                <div className="col-md-7 mx-auto px-5 mb-3 d-flex align-items-center">
                    <div className="d-flex col-md-2 justify-content-center gap-3">
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="pencil">Pencil</label>
                            <input
                                id="pencil"
                                type="radio"
                                name="tool"
                                checked={tool === "pencil"}
                                value="pencil"
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="line">line</label>
                            <input
                                id="line"
                                type="radio"
                                name="tool"
                                value="line"
                                checked={tool === "line"}
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-1 align-items-center">
                            <label htmlFor="rect">Box</label>
                            <input
                                id="rect"
                                type="radio"
                                name="tool"
                                value="rect"
                                checked={tool === "rect"}
                                onChange={(e) => setTool(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 mx-auto">
                        <div className="d-flex align-items-center justify-center">
                            <label htmlFor="color">Select Color : </label>
                            <input
                                type="color"
                                id="color"
                                className="mt-1 ms-3"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-3 d-flex gap-2">
                        <button
                            className="btn btn-primary mt-1"
                            disabled={elements.length === 0}
                            onClick={handleUndo}
                        >
                            Undo
                        </button>
                        <button
                            className="btn btn-outline-primary mt-1"
                            disabled={history.length === 0}
                            onClick={handleRedo}
                        >
                            Redo
                        </button>
                    </div>

                    <div className="col-md-2">
                        <button
                            className="btn btn-danger"
                            onClick={handleClearCanvas}
                        >
                            Clear Canvas
                        </button>
                    </div>
                </div>
            )}

            <div className="col-md-10 mx-auto h-[75%]">
                <Whiteboard
                    canvasRef={canvasRef}
                    ctxRef={ctxRef}
                    elements={elements}
                    setElements={setElements}
                    tool={tool}
                    color={color}
                    user={user}
                    socket={socket}
                />
            </div>
        </div>
    );
}
