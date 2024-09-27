import React from 'react';
import Sidebar from './layout/Sidebar';
import { Outlet } from 'react-router-dom';
import '../component/Dashboard.css'; // Add styling for dashboard layout
import useAuth from '../hook/useAuth';
const Dashboard = () => {
    const { auth } = useAuth()
console.log("desboard----->",auth.data)
    const { user_account_id = null, roles_id = null } = auth? auth.data : {};


    return (
        <div className="dashboard">
            <Sidebar userid={roles_id} />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
