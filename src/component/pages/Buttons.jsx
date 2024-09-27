import React, { useState, useRef } from 'react';
import './Buttons.css'

// SVG Icons
const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ArrowDropDownSharpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);

export const Buttons = ({ tag, filters, setUsers, jobs }) => {
    const [state, setState] = useState(false);
    const [crss, setCrss] = useState(true);
    const [label, setLabel] = useState("");
    const buttref = useRef();
    const options = useRef();

    const handleClick = () => {
        setState(prev => !prev);
    };

    const handlein = (e) => {
        buttref.current.innerText = e.target.innerText;
        let temp = buttref.current.innerText;
        if (tag === "Date Posted") {
            let filterDate = temp.length === 12 ? Number(temp.slice(5, 7)) : Number(temp.slice(5, 6));
            let fData = jobs.filter((el) => Number(el.date) <= filterDate);
            setUsers(fData);
        } else if (tag === "Remote") {
            let fData = jobs.filter((el) => el.remote === (temp[0] === "W" ? "Work From Home" : "Onsite"));
            setUsers(fData);
        } else if (tag === "Education level") {
            let filterEducation = temp[0] === "B" ? "btech" : (temp[1] === "2" ? "intermediate" : "matric");
            let fData = jobs.filter((el) => el.education === filterEducation);
            setUsers(fData);
        } else if (tag === "Company") {
            let fData = jobs.filter((el) => el.companyName === temp);
            setUsers(fData);
        }
    };

    return (
        <div className="relative">
            <button
                ref={buttref}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-between text-white ${crss ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} transition`}
                onClick={handleClick}
            >
                <span>{label === "" ? tag : label}</span>
                {crss ? <ArrowDropDownSharpIcon /> : <ClearIcon onClick={() => {
                    setCrss(!crss);
                    setUsers(jobs);
                }} />}
            </button>
            <div
                ref={options}
                className={`absolute w-full mt-2 bg-white shadow-lg rounded-lg ${state ? 'block' : 'hidden'}`}
                style={{ zIndex: 12 }}
            >
                {filters.map((el) => (
                    <p
                        key={el}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={(e) => {
                            handlein(e);
                            setLabel(el);
                            handleClick();
                            setCrss(false);
                        }}
                    >
                        {el}
                    </p>
                ))}
            </div>
        </div>
    );
};
