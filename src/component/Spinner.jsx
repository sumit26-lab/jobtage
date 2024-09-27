import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

export const Spinner = ({loading}) => {
    let cssOverride={
        display:'block',
        margin:'100 auto'
    }
  return (
   <ClipLoader color='#4338ca' loading={loading} cssOverride={cssOverride} size={50}/>
  )
}
