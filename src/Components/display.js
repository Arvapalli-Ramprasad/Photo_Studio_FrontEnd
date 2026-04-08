import React,{useState} from 'react';

const Display = ({selectedRoom})=>{

     if (!selectedRoom) return <p>Select a room</p>;
    return (
        <div className='display-items'>
            <p>{selectedRoom.email}</p>
            <p>{selectedRoom.mobileNumber}</p>
            <p>{selectedRoom.roles}</p>
            <p>{selectedRoom.name}</p>

        </div>
    )
}

export default Display