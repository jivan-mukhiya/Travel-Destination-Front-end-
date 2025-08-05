import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthAlert from './auth/AuthAlert';
import AuthInput from './auth/AuthInput';
import AuthButton from './auth/AuthButton ';

const UserDetailsForm = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dob: '',
    profession: '',
    budgetMin: '',
    budgetMax: '',
    travelTypePreference: 'beach',
    seasonPreference: 'summer',
    pastVisitedDestinations: '',
    preferences: '',
    userLoginId: email || ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.profession) newErrors.profession = 'Profession is required';
    if (isNaN(formData.budgetMin) || formData.budgetMin < 0) newErrors.budgetMin = 'Invalid minimum budget';
    if (isNaN(formData.budgetMax) || formData.budgetMax < 0) newErrors.budgetMax = 'Invalid maximum budget';
    if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) {
      newErrors.budgetMax = 'Maximum budget should be greater than minimum';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
        dob: new Date(formData.dob).toISOString().split('T')[0],
        pastVisitedDestinations: formData.pastVisitedDestinations
          ? formData.pastVisitedDestinations.split(',').map(item => item.trim())
          : [],
        preferences: formData.preferences
          ? formData.preferences.split(',').map(item => item.trim())
          : []
      };

      const response = await axios.post(
        `http://localhost:9000/api/v1/user/add/${email}`,
        submissionData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('User details saved successfully:', response.data);
      setSuccess(true);
      setTimeout(() => navigate('/user/login'), 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        server: error.response?.data?.message || 'Failed to save details. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Updated Successfully!</h2>
          <p className="text-gray-600 mb-6">Your travel preferences have been saved. Redirecting to login page...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Left Side */}
          <div className="md:w-1/3 bg-indigo-600 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Complete Your Travel Profile</h2>
              <p className="mb-6">Help us recommend the perfect destinations based on your preferences</p>
              <div className="w-full bg-indigo-500 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="mt-2 text-sm text-indigo-200">Step 2 of 2</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Travel Preferences</h1>

            {errors.server && <AuthAlert message={errors.server} type="error" />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuthInput id="name" name="name" label="Full Name" placeholder="Amit Patel" value={formData.name} onChange={handleChange} error={errors.name} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="flex space-x-4">
                    {['male', 'female', 'other'].map(gender => (
                      <label key={gender} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <AuthInput id="dob" name="dob" type="date" label="Date of Birth" value={formData.dob} onChange={handleChange} error={errors.dob} />
                <AuthInput id="profession" name="profession" label="Profession" placeholder="Doctor, Engineer" value={formData.profession} onChange={handleChange} error={errors.profession} />
                <AuthInput id="budgetMin" name="budgetMin" type="number" label="Minimum Budget (₹)" placeholder="25000" value={formData.budgetMin} onChange={handleChange} error={errors.budgetMin} />
                <AuthInput id="budgetMax" name="budgetMax" type="number" label="Maximum Budget (₹)" placeholder="50000" value={formData.budgetMax} onChange={handleChange} error={errors.budgetMax} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type Preference</label>
                  <select
                    name="travelTypePreference"
                    value={formData.travelTypePreference}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="historical">Historical</option>
                    <option value="adventure">Adventure</option>
                    <option value="wildlife">Wildlife</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season Preference</label>
                  <select
                    name="seasonPreference"
                    value={formData.seasonPreference}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="monsoon">Monsoon</option>
                    <option value="spring">Spring</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <AuthInput id="pastVisitedDestinations" name="pastVisitedDestinations" label="Previously Visited Destinations (comma separated)" placeholder="Goa, Pokhara" value={formData.pastVisitedDestinations} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <AuthInput id="preferences" name="preferences" label="Travel Preferences (comma separated)" placeholder="Hiking, Scuba diving" value={formData.preferences} onChange={handleChange} />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
                <AuthButton type="submit" isLoading={isLoading} fullWidth={false}>
                  Save & Continue
                </AuthButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
