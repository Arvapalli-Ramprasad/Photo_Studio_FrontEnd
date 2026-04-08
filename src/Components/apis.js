import axios from 'axios'
import React, { useState } from 'react'

export const Apis = ({setProducts}) => {


    // const [products, setProducts] = useState("")  // in app.js for communication btw components apis and the renderproducts

    function getAllUsers(event){
        event.preventDefault()
        
        axios.get('https://fakestoreapi.com/products')
        .then(res=>{
            setProducts(res.data)
        })

    }


  return (
    <div>
        <form onSubmit={getAllUsers}>
            <button>Submit</button>
        </form>
    </div>


  )

}


export default Apis