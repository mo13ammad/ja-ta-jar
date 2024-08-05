import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from './Spinner';

const LoginWithToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let token = new URLSearchParams(location.search).get('token');

  // Remove any trailing '=' characters from the token
  if (token) {
    token = token.replace(/=+$/, '');
  }

  useEffect(() => {
    if (token) {
      // Send the token in the body of the POST request
      axios.post('https://portal1.jatajar.com/api/auth/login/token', { token })
        .then(response => {
          const { token, user } = response.data.data;
          // Save token and user data to local storage
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));

          // Navigate to dashboard with token and user data
          navigate('/dashboard', { state: { token, user } });
        })
        .catch(error => {
          console.error('Login with token failed:', error);
          toast.error('Login with token failed. Please check the token or contact support.');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[100vh] flex items-center justify-center">
      <Spinner/>
    </div>
  );
};

export default LoginWithToken;
