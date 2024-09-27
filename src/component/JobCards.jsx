import React from 'react';

// SVG Icons
const StarRateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5l2.835 5.757 6.353.923-4.592 4.489 1.084 6.317L12 15.836l-5.68 2.987 1.084-6.317-4.592-4.489 6.353-.923L12 2.5z" />
    </svg>
);

export const JobCards = ({ ele, setDetails, crossit, setCrossit }) => {
    const [state, setState] = React.useState(false);
    const [status, setStatus] = React.useState(true);

    const handleClick = (e) => {
        setState(prev => !prev);
    };

    const saveJob = (id) => {
        let jobs = JSON.parse(localStorage.getItem('jobs'));
        localStorage.setItem('appliedJob', JSON.stringify(ele));
        const item = jobs.find(job => job.id === id);
        if (item) {
            setDetails(item);
        }
    };

    return (
        <div
            id={ele.id}
            className={`relative border border-gray-200 rounded-lg shadow-lg p-4 ${status ? "bg-white" : "bg-gray-100"}`}
            onClick={() => {
                saveJob(ele.id);
                setCrossit(false);
            }}
        >
            <nav className={`relative ${status ? "block" : "hidden"}`}>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-green-500 font-bold">new</p>
                    <div className="relative">
                        <button onClick={handleClick} className="p-2 rounded-md hover:bg-gray-200 focus:outline-none">
                            <span className="block w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                            <span className="block w-1.5 h-1.5 bg-gray-600 rounded-full mt-1"></span>
                            <span className="block w-1.5 h-1.5 bg-gray-600 rounded-full mt-1"></span>
                        </button>
                        {state && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
                                <p
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setStatus(!status)}
                                >
                                    Not Interested
                                </p>
                                <p className="p-2 hover:bg-gray-100 cursor-pointer">Save job</p>
                            </div>
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{ele.job}</h3>
                <h4 className="text-gray-700 mb-2 flex items-center">
                    {ele.companyName}
                    <p className="ml-2 text-gray-500">{ele.rating}.0</p>
                    <StarRateIcon className="ml-1" />
                </h4>
                <h4 className="text-gray-600 mb-2">{ele.city}, {ele.state}</h4>
                <img src="/freq.png" alt="Company logo" className="w-full h-auto mb-2" />
                <ul className="list-disc pl-5 mb-2 text-gray-700">
                    <li>{ele.skills1}</li>
                    <li>{ele.skills2}</li>
                </ul>
                <p className="text-gray-500">{ele.date} days ago</p>
            </nav>
            {!status && (
                <div className="absolute bottom-2 left-0 right-0 bg-gray-200 text-center py-2 rounded-lg shadow-md">
                    <div className="text-gray-700">Job removed</div>
                    <div
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => setStatus(!status)}
                    >
                        Undo
                    </div>
                </div>
            )}
        </div>
    );
};
