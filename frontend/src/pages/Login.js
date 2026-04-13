import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { loginUser } from '../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  // State to hold the email and password inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ADMIN_USERNAME = "admin@gmail.com";
    const ADMIN_PASS = "admin123";

    // 1. Check for Hard-coded Admin Credentials First
    if (formData.email === ADMIN_USERNAME && formData.password === ADMIN_PASS) {
      // Small delay for UI feel
      setTimeout(() => {
        setLoading(false);
        navigate('/admin'); 
      }, 600);
      return; // Exit the function so it doesn't try Firebase
    }

    // 2. If not admin, proceed to Firebase Login
    try {
      await loginUser(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-5">
            <h3 className="text-center mb-4">Welcome Back</h3>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            
            {/* Optional Footer/Link */}
            <div className="text-center mt-3">
              <a href="#!" className="text-decoration-none text-muted">Forgot password?</a>
            </div>

            <div className="text-center mt-2">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/register" className="text-decoration-none">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;