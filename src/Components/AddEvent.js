import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import "./AddEvent.css"

import api from './api';


const AddEvent = ({ onClose, refreshEvents }) => {

    const [coverFile, setCoverFile] = useState(null);
    const[message,setMessage] = useState("");
    const[updateValue,setUpdateValue]=useState({name:"",description:"",location:"",coverImageUrl:""})
    const navigate = useNavigate()    
    
     function updateEvent(e){
        let key = e.target.name
        setUpdateValue({...updateValue,[key]:e.target.value})
    }

        // 🔹 sanitize file name
    const sanitizeFileName = (name) => {
    return name
        .replace(/\s+/g, "_")          // replace spaces with _
        .replace(/[^\w.-]/g, "")       // remove special chars
    };



    async function setValues(event){

        event.preventDefault()

        let uploadedUrl = "";
        if (coverFile) {
            const safeFileName = `${Date.now()}_${sanitizeFileName(coverFile.name)}`;

            // 1. Get presigned URL
            const res = await api.get("/media/presigned-url", {
                params: {
                    fileName: safeFileName,
                    fileType: coverFile.type
                },
                
            });

            const { url, key } = res.data;

            // 2. Upload to S3
            await axios.put(url, coverFile, {
              headers: {
                "Content-Type": coverFile.type || "application/octet-stream",
              },
              onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`${coverFile.name}: ${percent}%`);
              },
            });

            const fileUrl = `${process.env.REACT_APP_S3_BASE_URL}/${key}`;
            

            // 3. Construct public URL (or get from backend)
            uploadedUrl = fileUrl; // or full URL if backend gives
        }


        try{
            const res = await api.post(
                "/events/addEvent",
                {
                    name:updateValue.name,
                    description:updateValue.description,
                    location:updateValue.location,
                    coverImageUrl: uploadedUrl
                },
            )
            setUpdateValue({name:"",description:"",location:"",coverImageUrl:""})
            alert("Event Successfully Added")
            refreshEvents();
             if (onClose) onClose();
            navigate("/")
            console.log(res.data.message)
         }
         catch(e){
            console.log(e.response.data)
            setMessage(e.response.data.error)
         }
        
    }

  return (
    <div>
        <form onSubmit={setValues}>
            {
                message && <h1 style={{color:"red"}}>{message}</h1>
            }
            <input 
                type='text'
                name='name' 
                placeholder='Enter Event Name'
                onChange={updateEvent}
                value={updateValue.name}
            ></input>

            <br></br>

            <input 
                type='text' 
                name='description' 
                placeholder='About Image'  
                onChange={updateEvent} 
                value={updateValue.description}>
            </input>

             <br></br>

            <input 
                type='text' 
                name='location' 
                placeholder='Location'  
                onChange={updateEvent} 
                value={updateValue.location}>
            </input>

             <br></br>

            <input 
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            />

             <br></br>

            <button>AddEvent</button>
        </form>
    </div>
  )
}

export default AddEvent