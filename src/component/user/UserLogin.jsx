/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from './auth/AuthForm';
import AuthAlert from './auth/AuthAlert';
import AuthInput from './auth/AuthInput';
import AuthButton from './auth/AuthButton ';


const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (errors.server) {
      setErrors(prev => ({ ...prev, server: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:9000/api/v1/login/user-login', 
        {
          username: formData.usernameOrEmail,
          email: formData.usernameOrEmail,
          password: formData.password
        }
      );
      
      
      const userData = response.data;
      
      const { password, ...safeUserData } = userData;
      
      const storage = rememberMe ? localStorage : sessionStorage;
      
      
      const oppositeStorage = rememberMe ? sessionStorage : localStorage;
      oppositeStorage.removeItem('user');
      
      
      storage.setItem('user', JSON.stringify(safeUserData));
      
      navigate('/user');
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid username/email or password';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setErrors({ server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Sign in to your account"
      subtitle="Or start your 14-day free trial"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkPath="/user/registration"
      onSubmit={handleSubmit}
    >
      {errors.server && (
        <AuthAlert 
          message={errors.server} 
          type="error" 
          className="mb-4"
        />
      )}
      
      <div className="rounded-md shadow-sm space-y-4">
        <AuthInput
          id="usernameOrEmail"
          name="usernameOrEmail"
          type="text"
          label="Username or Email"
          placeholder="Enter your username or email"
          value={formData.usernameOrEmail}
          onChange={handleChange}
          error={errors.usernameOrEmail}
          autoComplete="username"
          required
        />
        
        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a 
            href="/forgot-password" 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <div className="mt-6">
        <AuthButton 
          type="submit" 
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </AuthButton>
      </div>
    </AuthForm>
  );
};

export default LoginForm;