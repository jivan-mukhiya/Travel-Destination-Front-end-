import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus, FiX, FiUpload, FiImage } from "react-icons/fi";
import Button from "./Button";

function EditDestination() {
    let navigate = useNavigate();
    const { id } = useParams();
    
    const [destination, setDestination] = useState({
        name: '',
        type: 'mountain',
        costPerDay: '',
        bestSeasonToVisit: 'summer',
        recommendedFor: '',
        activityTags: [],
        description: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);

    const seasonOptions = ['summer', 'winter', 'spring', 'autumn'];
    const typeOptions = ['mountain', 'lake', 'city', 'beach', 'historical', 'wildlife'];

    useEffect(() => {
        loadDestination();
    }, []);

    const loadDestination = async () => {
        try {
            const result = await axios.get(`http://localhost:9000/api/v1/destination/${id}`);
            const destinationData = {
                ...result.data,
                recommendedFor: result.data.recommendedFor.join(', ')
            };
            setDestination(destinationData);
        } catch (err) {
            console.error("Failed to load destination:", err);
            setError("Failed to load destination data. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDestination({ ...destination, [name]: value });
    };

    const handleTagInput = (e) => {
        setTagInput(e.target.value);
    };

    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !destination.activityTags.includes(tagInput.trim())) {
            setDestination({
                ...destination,
                activityTags: [...destination.activityTags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setDestination({
            ...destination,
            activityTags: destination.activityTags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewImage(null);
    };

    const updateDestination = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!destination.name.trim()) {
                throw new Error('Destination name is required');
            }
            if (!destination.costPerDay) {
                throw new Error('Cost per day is required');
            }
            if (isNaN(destination.costPerDay)) {
                throw new Error('Cost per day must be a number');
            }
            if (!destination.recommendedFor.trim()) {
                throw new Error('Recommended for is required');
            }

            const destinationData = {
                name: destination.name.trim(),
                type: destination.type,
                costPerDay: parseFloat(destination.costPerDay),
                bestSeasonToVisit: destination.bestSeasonToVisit,
                recommendedFor: destination.recommendedFor.split(',').map(item => item.trim()),
                activityTags: destination.activityTags,
                description: destination.description
            };

            const formDataToSend = new FormData();
            
            const jsonBlob = new Blob([JSON.stringify(destinationData)], {
                type: 'application/json'
            });
            
            formDataToSend.append('destination', jsonBlob);
            
            if (imageFile) {
                formDataToSend.append('imageFile', imageFile);
            }

            console.log('Sending data:', destinationData); 
            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value); 
            }

            const response = await axios.put(
                `http://localhost:9000/api/v1/destination/update/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                setSubmitSuccess(true);
                setTimeout(() => {
                    navigate("/admin/list/destination");
                }, 2000);
            }
        } catch (err) {
            console.error('Update error:', err);
            let errorMessage = 'Failed to update destination. Please try again.';
            
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex pt-16 justify-center">
            <div className="w-[80%] max-w-3xl">
                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">EDIT DESTINATION</h1>
                
                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Destination updated successfully! Redirecting...
                    </div>
                )}
                
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={updateDestination}>
                    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={destination.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter destination name"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Type *</label>
                                <select
                                    name="type"
                                    value={destination.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    {typeOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Best Season */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Season *</label>
                                <select
                                    name="bestSeasonToVisit"
                                    value={destination.bestSeasonToVisit}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    {seasonOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Cost Per Day */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Day (USD) *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="costPerDay"
                                    value={destination.costPerDay}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Recommended For */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Recommended For *
                            </label>
                            <input
                                type="text"
                                name="recommendedFor"
                                value={destination.recommendedFor}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter comma separated values (e.g., Adventure, Relaxation, Nature)"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={destination.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter destination description"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination Image</label>
                            <div className="mt-1 flex items-center">
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <FiUpload className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                                    {imageFile ? 'Change Image' : 'Upload Image'}
                                </label>
                                <input
                                    id="image-upload"
                                    name="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <FiX className="-ml-1 mr-1 h-5 w-5 text-red-500" />
                                        Remove
                                    </button>
                                )}
                            </div>
                            {previewImage ? (
                                <div className="mt-2">
                                    <div className="w-40 h-40 relative">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                </div>
                            ) : destination.imagePath && (
                                <div className="mt-2">
                                    <div className="w-40 h-40 relative">
                                        <img
                                            src={`http://localhost:9000/api/v1/destination/images/${destination.imagePath}`}
                                            alt="Current"
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Tags</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={handleTagInput}
                                    onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                                    placeholder="Add activity tag and press Enter"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Button
                                    onClick={addTag}
                                    variant="primary"
                                    size="medium"
                                    icon={FiPlus}
                                    className="rounded-r-lg"
                                />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {destination.activityTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                    >
                                        {tag}
                                        <Button
                                            variant="icon"
                                            icon={FiX}
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                            title="Remove tag"
                                        />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                disabled={isSubmitting}
                                className="w-full"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating Destination...
                                    </>
                                ) : (
                                    <>
                                        <FiImage className="-ml-1 mr-2 h-5 w-5" />
                                        Update Destination
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default EditDestination;