import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthForm from './auth/AuthForm';
import AuthButton from './auth/AuthButton ';
import AuthAlert from './auth/AuthAlert';
import AuthInput from './auth/AuthInput';


const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:9000/api/v1/login/create', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', response.data);
      setRegistrationSuccess(true);
      
    
      setTimeout(() => {
        navigate(`/user/user-details/${formData.email}`);
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setErrors({ server: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <AuthForm title="Registration Successful!">
        <AuthAlert 
          message="Your account has been created successfully. Redirecting to user details..." 
          type="success"
        />
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Create a new account"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkPath="/user/login"
      onSubmit={handleSubmit}
    >
      <AuthAlert message={errors.server} type="error" />
      
      <div className="rounded-md shadow-sm space-y-4">
        <AuthInput
          id="username"
          name="username"
          label="Username"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />
        
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        
        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the <a href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
        </label>
      </div>

      <AuthButton isLoading={isLoading}>
        Register
      </AuthButton>
    </AuthForm>
  );
};

export default RegisterForm;