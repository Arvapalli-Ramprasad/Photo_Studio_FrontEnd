import React,{useContext, useEffect, useState} from 'react'
import axios from 'axios';

//for global and not to depend on props
import UserContext from './Context/UserContext';

// for navigation
import { useNavigate } from 'react-router-dom';

const List = () => {

  const [users, setUsers] = useState([]); 

  //Using the context and getting the global values
  const{token, setToken} = useContext(UserContext)

//   forNavigation
 const navigate = useNavigate()



 // when we reload this logic sets the token if it exists in the local storage
 useEffect(()=>{
    if(token==""){
        let localToken = localStorage.getItem("token")
        if(localToken==undefined){
            navigate("/login")
        }else{
            setToken(JSON.parse(localToken))
        }
    }
 },[])

  async function gettAllUsers() {
    try {
      const response = await axios.get(
        "http://localhost:8080/auth/getAllUsers?limit=50&offset=0",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setUsers(response.data.content); 
    } catch (e) {
      console.log(e.message);
    }
  }
  console.log("yes i got it", token);




  // api to be deb=veloped by the backend developer to log out in the backend as of now dong it in the frontend 
  // we need to delete the token in bot front and backend

  async function logOut(){
    try{
        setToken("")
        setUsers([])
        // removing the token from the local storage
        localStorage.removeItem("token")

        alert("Logout Successful")
        navigate("/login")
        console.log("I am inside the LOGOUT")
    }catch(e){
        console.log(e.message)
    }
  }



  return (
    <div className='rooms'>
      {
        users && users.map((item, index) => (
          <div className='items' key={index}>
            <h1>Name: {item.name}</h1>
            <p>Email: {item.email}</p>
          </div>
        ))
      }

      <button onClick={gettAllUsers}>Get Users</button>

      <button onClick={logOut}>Logout</button>
    </div>
  );
}

export default List;