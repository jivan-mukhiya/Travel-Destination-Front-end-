import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthAlert from './auth/AuthAlert';
import AuthInput from './auth/AuthInput';
import AuthButton from './auth/AuthButton ';


const EditUserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    gender: '',
    dob: '',
    profession: '',
    budgetMin: '',
    budgetMax: '',
    travelTypePreference: '',
    seasonPreference: '',
    pastVisitedDestinations: '',
    preferences: '',
    userName: '',
    userEmail: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!userData || !userData.id) return;

    axios.get(`http://localhost:9000/api/v1/user/${userData.id}`)
      .then(res => {
        const user = res.data;
        setFormData({
          userId: user.userId || user.id || userData.id,
          name: user.name || '',
          gender: user.gender || '',
          dob: user.dob || '',
          profession: user.profession || '',
          budgetMin: user.budgetMin || '',
          budgetMax: user.budgetMax || '',
          travelTypePreference: user.travelTypePreference || '',
          seasonPreference: user.seasonPreference || '',
          pastVisitedDestinations: user.pastVisitedDestinations?.join(', ') || '',
          preferences: user.preferences?.join(', ') || '',
          userEmail: userData.email || '',
          userName: userData.username || ''
        });
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setErrors({ server: 'Failed to load user data' });
      });
  }, []);

  const handleChange = e => {
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
    if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) newErrors.budgetMax = 'Maximum must be greater than minimum';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
        dob: new Date(formData.dob).toISOString().split('T')[0],
        pastVisitedDestinations: formData.pastVisitedDestinations.split(',').map(s => s.trim()),
        preferences: formData.preferences.split(',').map(s => s.trim())
      };

      await axios.put('http://localhost:9000/api/v1/user/update', payload);
      navigate('/user/profile'); 
    } catch (err) {
      console.error('Update error:', err);
      setErrors({ server: 'Failed to update profile. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Travel Profile</h2>
            <p>Update your preferences to get better suggestions</p>
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-xl font-bold mb-4">Edit Preferences</h1>
            {errors.server && <AuthAlert message={errors.server} type="error" />}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AuthInput name="name" label="Full Name" value={formData.name} onChange={handleChange} error={errors.name} />
                <AuthInput name="dob" type="date" label="Date of Birth" value={formData.dob} onChange={handleChange} error={errors.dob} />
                <AuthInput name="profession" label="Profession" value={formData.profession} onChange={handleChange} error={errors.profession} />
                <AuthInput name="budgetMin" type="number" label="Minimum Budget ($)" value={formData.budgetMin} onChange={handleChange} error={errors.budgetMin} />
                <AuthInput name="budgetMax" type="number" label="Maximum Budget ($)" value={formData.budgetMax} onChange={handleChange} error={errors.budgetMax} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Type</label>
                  <select
                    name="travelTypePreference"
                    value={formData.travelTypePreference}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="beach">Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="historical">Historical</option>
                    <option value="adventure">Adventure</option>
                    <option value="wildlife">Wildlife</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Season Preference</label>
                  <select
                    name="seasonPreference"
                    value={formData.seasonPreference}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="summer">Summer</option>
                    <option value="winter">Winter</option>
                    <option value="monsoon">Monsoon</option>
                    <option value="spring">Spring</option>
                  </select>
                </div>
              </div>

              <AuthInput name="pastVisitedDestinations" label="Visited Destinations" value={formData.pastVisitedDestinations} onChange={handleChange} />
              <AuthInput name="preferences" label="Preferences" value={formData.preferences} onChange={handleChange} />

              <div className="flex justify-end">
                <AuthButton type="submit" isLoading={isLoading} fullWidth={false}>
                  Save Changes
                </AuthButton>
              </div>    
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
