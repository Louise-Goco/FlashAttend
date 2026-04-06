import React, { useState } from 'react';

const Login = () => {
  // State to hold the email and password inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend API
    console.log('Login Details:', formData);
    alert(`Logging in with Email: ${formData.email}`);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body p-5">
            <h3 className="text-center mb-4">Welcome Back</h3>
            
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
                <button type="submit" className="btn btn-primary btn-lg">
                  Login
                </button>
              </div>
            </form>
            
            {/* Optional Footer/Link */}
            <div className="text-center mt-3">
              <a href="#!" className="text-decoration-none text-muted">Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;