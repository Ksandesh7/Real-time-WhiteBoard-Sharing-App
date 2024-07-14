import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JoinRoom({uuid, socket, setUser}) {

  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");


  const handleRoomJoin = (e) => {
    e.preventDefault();

    const roomData = {
      name, 
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };
    setUser(roomData);
    navigate(`${roomId}`);
    socket.emit("userJoined", roomData);
  }

  return (
    <form className='form col-md-12 mt-5'>
        <div className='form-group'>
            <input value={name} onChange={e=>setName(e.target.value)} type='input' className='form-control my-2' placeholder='Enter Your Name' />
        </div>

        <div className='form-group'>
            <div className='input-group d-flex align-items-center justify-content-center'>
                <input type='text' value={roomId} onChange={e=>setRoomId(e.target.value)} className='form-control border-1' placeholder='Enter Room Code'/>
            </div>
        </div>

        <button onClick={handleRoomJoin} type='submit' className='mt-4 btn btn-primary btn-block form-control'>Join Room</button>
    </form>
  )
}
