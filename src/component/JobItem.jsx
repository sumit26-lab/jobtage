import React from 'react';
import { Link } from 'react-router-dom';

const JobItem = ({ job }) => (
  <div className="border border-gray-300 p-4 rounded-lg mb-4 shadow-md">
    <h2 className="text-xl font-semibold">{job.title}</h2>
    <h3 className="text-gray-700">{job.company}</h3>
    <p className="text-gray-500">{job.location}</p>
    <p className="text-gray-600">{job.description}</p>
    <Link to={`/jobs/${job.id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Details</Link>
  </div>
);

export default JobItem;
