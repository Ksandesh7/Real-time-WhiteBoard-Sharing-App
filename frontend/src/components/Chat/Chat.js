import React, { useEffect, useState } from 'react'

export default function Chat({setOpenedChatTab, socket}) {

    const [chat, setChat] = useState([])
    const [message, setMessage] = useState("")

    useEffect(()=>{
        const handleMessageResponse = (data) => {
            setChat((prevChat) => [...prevChat, data]);
        };

        socket.on("messageResponse", handleMessageResponse);

        return () => {
            socket.off("messageResponse", handleMessageResponse);
        };
    }, [socket])

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log("message", message);
        if(message.trim()!=="") {
            socket.emit("message", {message});
            setChat((prevChats)=>[...prevChats, {message, name: "You"}]);
            setMessage("");
        }

    }

  return (
    <div
        className="position-fixed top-0 left-0 h-100 bg-dark"
        style={{ width: "300px", left: "0%"}}
    >
        <button
            type="button"
            onClick={() => setOpenedChatTab(false)}
            className="btn btn-light btn-block w-[80px] mt-5"
        >
            Close
        </button>

        <div className="w-100 mt-3 p-2 border border-1 border-white rounded-3" style={{height:"70%", overflowY: "auto"}}>
            {
                chat.map((msg, index)=>(
                    <p key={index*999} className='my-2 text-center w-100 text-white'>
                        {msg.name}:{msg.message}
                    </p>
                ))
            }
        </div>


        <form onSubmit={handleSubmit} className='w-100 mt-4 d-flex rounded-3'>
            <input type="text" placeholder='Enter Message' className='h-100 border-0 rounded-0 py-2 px-4' style={{width:"90%"}} value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button type='submit' className='btn btn-primary rounded-0'>Send</button>
        </form>
    </div>
  )
}
