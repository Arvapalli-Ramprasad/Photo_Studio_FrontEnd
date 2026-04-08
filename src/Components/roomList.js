import React, { useState } from 'react';
import Display from './display';

import rooms from "../Data/room"


const RomList = ({setSelectedRoom}) => {

  

    function setRoom(item) {
        setSelectedRoom(item)
    }

    return (
        <div className='movie-list'>

            <div>{
                rooms.map((item) => (
                    <h1 onClick={() => setRoom(item)}>{item.name}</h1>
                ))
            }
            </div>

            <div>
                {/* disply content */}
                {/* {
                    selectedRoom && (
                        <p>{selectedRoom.email}</p>
                    )
                } */}



                {/* communicating with disply //// it is depenent  */}

                {/* {
                    selectedRoom!=null && <Display selectedRoom={selectedRoom}/>
                } */}
            </div>

        </div>
    )
}


export default RomList

