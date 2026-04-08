import React,{useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// for global setting of fun or variable
import UserContext from './Context/UserContext'
import api from './api'

const Login1 = () => {
    const[updateValue,setUpdateValue]=useState({email:"",password:""})
    const[message, setMessage]=useState("")
    const navigate = useNavigate()

    const {setToken} = useContext(UserContext)


    useEffect(()=>{
        let localToken = localStorage.getItem("token")
        if(localToken!=undefined){
            navigate("/rooms")
        }
    },[])


    function updateUser(e){
        let key = e.target.name
        setUpdateValue({...updateValue,[key]:e.target.value})
    }

    async function setValues(event){
        event.preventDefault()

        if(!updateValue.email || !updateValue.password){
            setMessage("Please fill all the details")
            return
        }


        try{
            const res = await api.post("/auth/generateToken",{
                email:updateValue.email,
                password:updateValue.password
            })
            setUpdateValue({email:"",password:"",})
            setToken(res.data.token)
            alert("Login Successful")

            // adding token to the local storage
            let localToken = JSON.stringify(res.data.token)
            localStorage.setItem("token",localToken)
            navigate("/")
            

            console.log(res.data.message)
         }
         catch(e){
            console.log(e.response.data)
            setMessage(e.response.data.error)
         }
        
    }

  return (

    <div className='login1'>
        <button className="back-btn" onClick={() => navigate("/")}>
            &larr;
        </button>
        <form onSubmit={setValues}>
            <h1>Login</h1>
            {
                message && <h1 style={{color:"red"}}>{message}</h1>
            }
            <input 
                type='email'
                name='email' 
                placeholder='Enter Email'
                onChange={updateUser}
                value={updateValue.email}
            ></input>

            <br></br>

            <input 
                type='password' 
                name='password' 
                placeholder='Entre Password'  
                onChange={updateUser} 
                value={updateValue.password}>
            </input>
            <button>Login</button>
        </form>

    </div>

)}

    export default Login1