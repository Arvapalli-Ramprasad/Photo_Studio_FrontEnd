import React, {useState} from 'react'
// import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import api from './api'

const SignUp1 = () => {

    const[updateValue,setUpdateValue]=useState({name:"",email:"",password:"",confirmPassword:""})
    const[message, setMessage]=useState("")
    const navigate = useNavigate()


    function updateUser(e){
        let key = e.target.name
        setUpdateValue({...updateValue,[key]:e.target.value})
    }

    async function setValues(event){
        event.preventDefault()

        if(!updateValue.name || !updateValue.email || !updateValue.password || !updateValue.confirmPassword){
            setMessage("Please fill all the details")
            return
        }

        if(updateValue.password!==updateValue.confirmPassword){
            setMessage("Passord Mismatch")
            return
        }

        try{
            const res = await api.post("/auth/addNewUser",{
                name:updateValue.name,
                email:updateValue.email,
                password:updateValue.password
            })
            setMessage(res.data.message)
            setUpdateValue({name:"",email:"",password:"",confirmPassword:""})
            navigate("/login")
            console.log(res.data.message)
         }
         catch(e){
            console.log(e.messege)
            setMessage(e.response.data.error)
         }
        
    }

  return (
    <div className='login1'>
        <form onSubmit={setValues}>
            <h1>Sign Up</h1>
            {
                message && <h1 style={{color:"red"}}>{message}</h1>
            }
            <input 
                type='text'
                name='name' 
                placeholder='Enter Name'
                onChange={updateUser}
                value={updateValue.name}
            ></input>

            <br></br>

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
                value={updateValue.password}
            ></input>

             <br></br>

            <input 
                type='confirmPassword' 
                name='confirmPassword' 
                placeholder='Confirm Password'  
                onChange={updateUser} 
                value={updateValue.confirmPassword}
            ></input>

             <br></br>

            <button>SignUp</button>
        </form>
    </div>
  )
}

export default SignUp1