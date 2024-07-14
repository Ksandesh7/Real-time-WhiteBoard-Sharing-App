// import logo from './logo.svg';
import './App.css';
import Room from './components/forms/Room';
import {Routes, Route} from 'react-router-dom'
import Roompage from './pages/Roompage';
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import {toast, ToastContainer} from 'react-toastify'

const server = "http://localhost:5000"
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
}

const socket = io(server, connectionOptions);

function App() {
 
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(()=>{
    socket.on("userIsJoined", (data)=> {
      console.log("data", data);
      if(data.success) {
        console.log("UserJoined");
        setUsers(data.users);
      }
      else {
        console.log("UserJoining Error");
      }
    })

    socket.on("allUsers", data=>{
      setUsers(data);
    })

    socket.on("userJoinedMessageBroadcasted", data=>{
      toast.info(`${data} joined the room`)
    })

    socket.on("userLeftMessageBroadcasted", (data)=>{
      toast.info(`${data} left the room`);
    })
  }, [])

  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };


 
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Room uuid={uuid} socket={socket} setUser={setUser}/>}></Route>
        <Route path='/:roomId' element={<Roompage user={user} socket={socket} users={users} />}></Route>
      </Routes>
    </div>
  );
}

export default App;
