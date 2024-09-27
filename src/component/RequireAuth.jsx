import { useLocation,Navigate,Outlet } from "react-router-dom";
import useAuth from "../hook/useAuth";
const RequireAuth=()=>{
    const {persist}=useAuth()
    console.log("persis",persist)
    const loaction= useLocation()
    return(
        persist?<Outlet/>:<Navigate to="/Login"/>
    )
}
export default  RequireAuth