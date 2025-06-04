import { motion } from 'framer-motion';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { useProjectContext } from '@/Context';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectRequestsPage() {
    const project = useProjectContext();
    const originalRequests = project.requests;

    const [requestsStatus, setRequestsStatus] = useState(() =>
        originalRequests.map((req) => ({
            ...req,
            status: 'pending', // can be 'pending', 'accepted', or 'rejected'
        }))
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAccept = (id) => {
        setRequestsStatus((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: 'accepted' } : req
            )
        );
    };

    const handleReject = (id) => {
        setRequestsStatus((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: 'rejected' } : req
            )
        );
    };

    const pendingRequests = requestsStatus.filter(
        (r) => r.status === 'pending'
    );

    return (
        <div className="max-w-8xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Project Contribution Requests
                </h1>
                <div className="text-sm text-gray-500">
                    {pendingRequests.length} pending request
                    {pendingRequests.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="space-y-4">
                {requestsStatus.map((request) => (
                    <motion.div
                        key={request.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            {/* Left Side - User Info */}
                            <div className="flex items-start space-x-4 mb-4 md:mb-0">
                                <div className="flex-shrink-0">
                                    <Link to={request.profilelink} className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        {request.avatar ? (
                                            <img
                                                src={request.avatar}
                                                alt={request.name}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg font-medium">
                                                {request.name.charAt(0)}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {request.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {request.email}
                                    </p>
                                    <div className="mt-2">
                                        <p className="text-sm">
                                            <span className="font-medium">
                                                Skills:
                                            </span>{' '}
                                            {request.techStack}
                                        </p>
                                        <p className="text-sm mt-1 text-gray-600">
                                            <span className="font-medium">
                                                Purpose:
                                            </span>{' '}
                                            {request.purpose}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Requested on:{' '}
                                        {formatDate(request.requestedOn)}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Action Buttons or Status */}
                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                                {request.status === 'pending' ? (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleAccept(request.id)
                                            }
                                            className="w-full bg-[#4977ec] rounded-md text-white px-4 py-2 md:w-32"
                                            btnText={'Accept'}
                                        />
                                        <Button
                                            onClick={() =>
                                                handleReject(request.id)
                                            }
                                            className="w-full bg-[#e14545] rounded-md text-white px-4 py-2 md:w-32"
                                            btnText={'Ignore'}
                                        />
                                    </>
                                ) : request.status === 'accepted' ? (
                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium text-center md:w-32">
                                        ✅ Accepted
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md text-sm font-medium text-center md:w-32">
                                        ❌ Rejected
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {pendingRequests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            {icons.checkCircle}
                        </div>
                        <h3 className="text-lg font-medium text-gray-600">
                            No pending requests
                        </h3>
                        <p className="text-gray-500 mt-1">
                            All contribution requests have been processed
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
