import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

// SVG for Cross Icon
const CrossIcon = ({ onClick }) => (
    <svg
        onClick={onClick}
        className="w-6 h-6 text-gray-800 cursor-pointer"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m15.536 7.8987c-0.1953-0.19526-0.5119-0.19526-0.7071 0l-2.8284 2.8284-2.8285-2.8284c-0.19526-0.19527-0.51185-0.19527-0.70711 0l-0.56568 0.56568c-0.19527 0.19526-0.19526 0.51185 0 0.70711l2.8285 2.8284-2.8285 2.8285c-0.19526 0.1952-0.19526 0.5118 0 0.7071l0.56568 0.5657c0.19527 0.1952 0.51185 0.1952 0.70711 0l2.8285-2.8285 2.8284 2.8284c0.1952 0.1953 0.5118 0.1953 0.7071 0l0.5657-0.5657c0.1952-0.1953 0.1952-0.5118 0-0.7071l-2.8284-2.8284 2.8283-2.8284c0.1953-0.19526 0.1953-0.51184 0-0.70711l-0.5656-0.56568z"
            fill="#2D2D2D"
        />
    </svg>
);

export const JobDetails = ({ details, crossit, setCrossit }) => {
    const [saved, setSaved] = useState(true);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">{details.job}</h3>
                </div>
                <CrossIcon onClick={() => setCrossit(!crossit)} />
            </div>

            <div className="mb-4">
                <h4 className="text-xl font-semibold text-gray-700">{details.companyName}</h4>
                <div className="flex items-center space-x-2 mb-1">
                    <StarRatings
                        rating={details.rating}
                        starDimension="13px"
                        starSpacing="1px"
                        starRatedColor="gold"
                    />
                    <p className="text-gray-600">- {details.remote}</p>
                </div>
                <p className="text-gray-600">{details.city}, {details.state}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <Link
                    to="/apply"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                >
                    Apply Now
                </Link>
                <button onClick={() => setSaved(!saved)}>
                    <img
                        src={saved ? "/heart.png" : "/oheart.png"}
                        alt="Save Job"
                        className="w-6 h-6"
                    />
                </button>
            </div>

            <div>
                <div className="prose">
                    <p className="font-semibold">Job Description:</p>
                    <p>
                        We are looking for talented graduate fresher male candidates for email marketing process. Interested candidates should apply if they are eligible for this job according to the job description. Your main duties include running email marketing campaigns end-to-end and working within a team to generate efficient results for our company.
                        <br />
                        <b>We arrange online interviews for this lockdown situation.</b>
                    </p>
                    <p>
                        <b><i>Before applying, check our location because we only hire local candidates due to COVID-19. We hire candidates who are at least one hour away, so check the location before applying; otherwise, we will reject your CV without any reply.</i></b>
                    </p>
                    <p>
                        <b><i>We don't charge for this job because this is an organization, not a consultancy. Don't worry about that.</i></b>
                    </p>
                    <p><b>Responsibilities and Duties:</b></p>
                    <ul>
                        <li>Generate leads on a daily basis through searching various domains.</li>
                        <li>Handle email marketing with different tools.</li>
                        <li>Formalize a deal report after completing all the campaigns.</li>
                    </ul>
                    <p><b>Required Experience, Skills, and Qualifications:</b></p>
                    <ul>
                        <li><b>Minimum Qualification:</b> Diploma (Engg.) / Graduation (Any)</li>
                        <li><b>Age:</b> 18 - 28 years only male candidates</li>
                        <li><b>Experience:</b> 0 - 6 months</li>
                        <li><b>Skills:</b></li>
                        <li>Basic knowledge of Microsoft Excel.</li>
                        <li>Good English writing skills & typing speed.</li>
                        <li>Must be smart to work under a team.</li>
                    </ul>
                    <p><b>Benefits:</b></p>
                    <ul>
                        <li>PF & ESIC are available.</li>
                        <li>Paid Leaves are available.</li>
                    </ul>
                    <p><b>Contact Person:</b> KARAN DORA (HR-Executive)</p>
                    <p><b>Contact Number:</b> <a href="tel:7890801159" className="text-blue-500">7890801159</a> (Office hours only)</p>
                    <p><b>Job Type:</b> Fresher</p>
                    <p><b>Salary:</b> ₹9,500.00 - ₹10,000.00 per month</p>
                    <p><b>Schedule:</b></p>
                    <ul>
                        <li>Morning shift</li>
                    </ul>
                    <p><b>Supplemental Pay:</b></p>
                    <ul>
                        <li>Commission pay</li>
                        <li>Performance bonus</li>
                    </ul>
                    <p><b>Education:</b></p>
                    <ul>
                        <li>Diploma (Required)</li>
                    </ul>
                    <p><b>Experience:</b></p>
                    <ul>
                        <li>Total work: 1 year (Preferred)</li>
                    </ul>
                    <p><b>Work Remotely:</b> No</p>
                    <p><b>Speak with the employer:</b> +91 <a href="tel:7890801159" className="text-blue-500">7890801159</a></p>
                </div>
            </div>
        </div>
    );
};
