// import React, { useEffect ,useState,useMemo} from 'react';
// import { io } from 'socket.io-client';
// import { Button,Container, TextField, Typography } from '@mui/material';
import Navbar from "../components/navbar.jsx";
// import Home from './components/home.jsx'
import { Outlet } from "react-router-dom";
function App() {
  // const [message,setMessage]=useState("");
  // const socket = io('http://localhost:4000');
  //   const socket=useMemo(()=>io('http://localhost:4000'),[]);
  // const handleSubmit=(e)=>{
  // e.preventDefault();
  // const data=e.target.value;
  // socket.emit("message",message);// here in place of message if i will make spell mistake then error will come
  // setMessage("");
  // }
  //   useEffect(() => {
  //     // socket.on('connection', () => {// here is parameter i don't need to pass socket in callback to avoid error
  //     //   console.log("connected,  line 17 id : ", socket.id); // Accessing socket.id directly
  //     // });
  // socket.on("message" ,(data)=>{
  // const lst=document.getElementById('lst');
  // const temp=document.createElement('li');
  // temp.textContent=data;
  // lst.appendChild(temp);
  //   console.log(data,'line-20');
  // })
  //     socket.on("welcome", (s) => {
  //       console.log(s, socket.id);
  //     });

  //     // return ()=>{
  //     //   socket.disconnect();
  //     // };
  //   }, []) ;

  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Chats/> */}
      {/* <Setting/> */}
      {/* <Container maxWidth='sm'>
      <Typography variant='h5' component='div' gutterBottom>
        Welcome to socket.io
      </Typography>
      <form value={message} onChange={(e)=>{
        setMessage(e.target.value);
      }} onSubmit={handleSubmit}>
        <TextField 
        id="outlined-basic" 
        placeholder='Type here .....'
        label="outlined"
         varient='outlined'
          
          // InputProps={{ inputProps: { disableunderline:"true" } }} 
          />
        <Button 
        type="submit"
         varient="container" 
         color="primary">
          Send
          </Button>
      </form>
      <ul id='lst'></ul>
    </Container> */}
    </>
  );
}

export default App;
