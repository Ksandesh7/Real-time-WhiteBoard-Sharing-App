import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateRoom({uuid, socket, setUser}) {

    const [roomId, setRoomId] = useState(uuid());
    const [name, setName] = useState("")
    const navigate = useNavigate();

    const handleCreateRoom = (e) => {
        e.preventDefault();

        const roomData = {      
            name, 
            roomId,
            userId: uuid(),
            host: true,
            presenter: true,
        }
        setUser(roomData);
        console.log(roomData);
        socket.emit("userJoined", roomData);
        navigate(`${roomId}`)
    }

    const handleCopyRoomId = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                toast.info("Room ID copied to clipboard")
                console.log("Room ID copied to clipboard");
            })
            .catch((err) => {
                console.error("Could not copy text: ", err);
            });
    };

    return (
        <form className="form col-md-12 mt-5">
            <div className="form-group">
                <input
                    required
                    type="input"
                    className="form-control my-2"
                    placeholder="Enter Your Name" 
                    value={name}
                    onChange={e=>setName(e.target.value)} 
                />
            </div>

            <div className="form-group d-flex">
                <div className="input-group align-items-center justify-content-center">
                    <input
                        type="text"
                        value={roomId}
                        className="form-control border-1"
                        placeholder="Generate Room Code"
                        disabled
                    />
                </div>

                <div className="input-group-append mt-2 d-flex">
                    <button
                        className="btn btn-primary btn-sm mx-1"
                        type="button"
                        onClick={e=>setRoomId(uuid())}
                    >
                        Generate
                    </button>
                    <button
                        className="btn btn-outline-danger btn-sm me-2"
                        type="button"
                        onClick={handleCopyRoomId}
                    >
                        Copy
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 btn btn-primary btn-block form-control"
                onClick={handleCreateRoom}
            >
                Generate Room
            </button>
        </form>
    );
}
