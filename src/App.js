import React, { useState } from 'react';
import './App.css';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

import RoomList from './Components/roomList'
import Display from './Components/display';
import Apis from './Components/apis';
import Renderproducts from './Components/renderproducts';
import Login1 from './Components/Login1';
import SignUp1 from './Components/SignUP1';

import {Routes, Route} from 'react-router-dom'
import List from './Components/List';
import Dashboard from './Components/Dashboard';
import AddEvent from './Components/AddEvent';
import MediaPage from './Components/MediaPage';


function App() {

    const [selectedRoom, setSelectedRoom] = useState(null)


    // api testing things
    const [products, setProducts] = useState(null)

     {/* setting the token */}
    // const [token, setToken] = useState("")


  return (
    <div className="App">
      {/* <Login/> */}
      {/* <SignUp/> */}
      {/* <RoomList/>
      <Display/> */}

      {/* for Rendering removing the dependency on eachother like it is independent now */}
      
      {/* <RoomList setSelectedRoom = {setSelectedRoom}/>
      <Display selectedRoom = {selectedRoom}/> */}


      {/* testing apis */}
      {/* <Apis setProducts = {setProducts}></Apis>
      <Renderproducts products={products}/> */}




      {/* Routing Explanation */}

     

      <Routes>
        <Route path = "" element = {<Dashboard/>} />
        <Route path = "signup" element={<SignUp1 />}/>
        {/* <Route path = "login" element={ <Login1 setToken = {setToken}/>}/>           making it global down */}
         <Route path = "login" element={ <Login1/>}/>
        
        {/* <Route path = "rooms" element = {<List token = {token}/>}/>                   making it global */}

        <Route path = "rooms" element = {<List/>}/>


        <Route path = "addEvent" element = { <AddEvent/>}/>
        <Route path="/images/:eventId" element = { <MediaPage/>}/>

        

      </Routes>
    </div>
  );
}

export default App;
