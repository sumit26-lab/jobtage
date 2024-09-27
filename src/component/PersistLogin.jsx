import { useState,useEffect } from "react";
import {useRefreshToken} from "../hook/useRefresh";
import React from 'react'
import useAuth from "../hook/useAuth";
import { Outlet } from "react-router-dom";

 const PersistLogin= () => {
    const[isLoading,setisLoading]=useState(true)
    const {auth,persist}=useAuth()
    console.log("persist",persist)
    let isMounted=true
    const refresh= useRefreshToken()
    const verifyRefreshToken=async()=>{ 
            
        try{
            await refresh()

        }catch(err){
            console.log(err)

        }finally{
            isMounted&&setisLoading(false)

        }
    }
    useEffect(()=>{
        
        if(persist){

            if(!auth?.accessToken){

                verifyRefreshToken()
            }
            else{
                setisLoading(false)
            }
            
            //!auth?.accessToken?verifyRefreshToken():setisLoading(false)
        }
        else{
            setisLoading(false)
        }
       
        
    },[persist,auth,refresh])
    
    useEffect(()=>{
        console.log(`Is Lodaing is ${isLoading}`)
        console.log(`At token ${JSON.stringify(auth?.accessToken)}`)
    },[auth,isLoading])
  return (
    <>{
        !persist?
        <Outlet/>:
        isLoading?
        <p>...LodingToken</p>
        :<Outlet/>
    }
    </>
  )
}
export default PersistLogin