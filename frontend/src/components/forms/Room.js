import React from 'react'
import CreateRoom from './CreateRoom'
import JoinRoom from './JoinRoom'

export default function Room({uuid, socket, setUser}) {
  return (
    <div className='row h-100 pt-5'>

      <div className='col-md-4 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items h-[400px] py-3 px-5'>
        <h1 className='text-primary fw-bold'>Create Room</h1>
        <CreateRoom uuid={uuid} socket={socket} setUser={setUser}/>
      </div>

      <div className='col-md-4 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items h-[400px] py-3 px-5'>
        <h1 className='text-primary fw-bold'>Join Room</h1>
        <JoinRoom uuid={uuid} socket={socket} setUser={setUser}/>
      </div>
      
    </div>
  )
}
