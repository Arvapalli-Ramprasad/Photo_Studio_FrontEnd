import React from 'react'

import renderlist from "./renderlist.css"


const Renderproducts = ({products}) => {

    console.log(products)

  return (
    <div className='cards'>
        {
            products && products.map(item=>
                <ul>
                    <li className='items'>{item.title}</li>
                </ul>

            )
        }
        
    </div>
  )
}

export default Renderproducts