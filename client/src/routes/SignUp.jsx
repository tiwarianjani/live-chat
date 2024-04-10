import { Link, Form, useNavigate } from "react-router-dom";
import "../styles/Login.css";
function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postData = Object.fromEntries(formData);
    // console.log(postData);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // console.log(response);
      if (response.ok) {
        navigate("/login");
      } else {
        throw new Error("Failed to sign up");
      }
    } catch (error) {
      console.error(error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div className="loginContainer">
      <Form method="POST" onSubmit={handleSubmit} className="inputContainer">
        <div className="Title">Create Account</div>
        <div className="LabelC">
          <label htmlFor="name" className="Label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Full Name"
            required
          />
        </div>
        <div className="LabelC">
          <label htmlFor="email" className="Label">
            Username:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            required
          />
        </div>
        <div className="LabelC">
          <label htmlFor="password" className="Label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="submitbtn">
          Ragister
        </button>
        <div className="nothave">
          {" "}
          Have an account?{" "}
          <Link to="/login" className="signupL">
            {" "}
            Sign In
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default SignUp;
