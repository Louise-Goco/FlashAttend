import React from "react";

const Profile = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ width: "22rem", borderRadius: "15px" }}>
        
        {/* Header/Cover Color */}
        <div className="rounded-top" style={{ height: "100px", backgroundColor: "#0d6efd" }}></div>
        
        <div className="card-body text-center position-relative">
          {/* Avatar - Offset upwards into the blue header */}
          <div 
            className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm mx-auto"
            style={{ 
              width: "90px", 
              height: "90px", 
              marginTop: "-60px", 
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#0d6efd",
              border: "4px solid white"
            }}
          >
            JD
          </div>

          <h4 className="card-title mt-3 mb-1 fw-bold">John Doe</h4>
          <p className="text-muted small mb-3">Full Stack Developer</p>
          
          <p className="card-text text-secondary px-2">
            Passionate about creating interactive UIs and clean, efficient React code. 
            Currently exploring the wonders of Bootstrap 5.
          </p>

          <hr className="my-4" />

          <div className="d-grid gap-2">
            <button className="btn btn-primary btn-sm rounded-pill">Follow</button>
            <button className="btn btn-outline-secondary btn-sm rounded-pill">Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;