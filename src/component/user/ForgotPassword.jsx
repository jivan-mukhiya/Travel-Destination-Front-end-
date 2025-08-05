import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from './auth/AuthForm';
import AuthAlert from './auth/AuthAlert';
import AuthInput from './auth/AuthInput';
import AuthButton from './auth/AuthButton ';

const ForgotPassword = () => {
//   const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
    if (errors.server) {
      setErrors(prev => ({ ...prev, server: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:9000/api/v1/auth/forgot-password', {
        email: email
      });
      
      console.log('Password reset email sent:', response.data);
      setSuccessMessage('Password reset link has been sent to your email');
      setErrors({});
      
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset link. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No account found with this email address';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setErrors({ 
        server: errorMessage 
      });
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkPath="/login"
      onSubmit={handleSubmit}
    >
      {errors.server && (
        <AuthAlert 
          message={errors.server} 
          type="error" 
          className="mb-4"
        />
      )}
      
      {successMessage && (
        <AuthAlert 
          message={successMessage} 
          type="success" 
          className="mb-4"
        />
      )}
      
      <div className="rounded-md shadow-sm space-y-4">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="Enter your registered email"
          value={email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          required
        />
      </div>

      <div className="mt-6">
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </AuthButton>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Didn't receive the email? Check your spam folder or 
          <button 
            type="button" 
            onClick={handleSubmit}
            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
          >
            resend
          </button>
        </p>
      </div>
    </AuthForm>
  );
};

export default ForgotPassword;