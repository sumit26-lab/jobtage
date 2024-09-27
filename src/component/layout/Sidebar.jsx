import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Sidebar.css'; // Add styling for sidebar
import useAuth from '../../hook/useAuth';

const Sidebar = ({ userid, }) => {
    console.log("sidebar-->", userid );
    const data = { id: 1, name: 'Example' };

    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                {/* Admin Role */}
                {userid == 3 ? (
                    <>
                        <li>
                            <NavLink to="search" className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
                        </li>
                        <li>
                            <NavLink to="Add-company" className={({ isActive }) => (isActive ? 'active' : '')}>Company Profile</NavLink>
                        </li>
                        <li>
                            <NavLink to="admin-settings" className={({ isActive }) => (isActive ? 'active' : '')}>Admin Settings</NavLink>
                        </li>
                    </>
                ) : userid === 2 ? (
                    <>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
                        </li>
                        <NavLink
                            to={ `/dashboard/review?id=${'Recuretpage'}`}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Reviewed
                        </NavLink>


                        <li>
                            <NavLink to="Add-company" className={({ isActive }) => (isActive ? 'active' : '')}>Company Profile</NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Search</NavLink>
                        </li>
                        <li>
                            <NavLink to="review" className={({ isActive }) => (isActive ? 'active' : '')}>Reviewed</NavLink>
                        </li>
                        <li>
                            <NavLink to="profile" className={({ isActive }) => (isActive ? 'active' : '')}>User Profile</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
