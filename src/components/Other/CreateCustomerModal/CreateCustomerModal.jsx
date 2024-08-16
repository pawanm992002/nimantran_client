import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const CreateCustomerJSX = ({ showModal, setShowModal }) => {
  const token = localStorage.getItem("token");
  const [togglePassword, settogglePassword] = useState(false);
  const nameRef = useRef("");
  const mobileRef = useRef("");
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const genderRef = useRef("");
  const dateOfBirthRef = useRef(null);
  const locationRef = useRef("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name.trim()) {
      setNameError("Name is required");
    } else if (name.length < 3 || name.length > 20) {
      setNameError("Name must be between 3 and 20 characters");
    } else if (!nameRegex.test(name)) {
      setNameError("Name must contain only letters and spaces");
    } else {
      setNameError("");
    }
  };

  const createCustomer = async () => {
    try {
      const newCustomer = {
        name: nameRef.current.value,
        mobile: mobileRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        gender: genderRef.current.value,
        dateOfBirth: dateOfBirthRef.current.value,
        location: locationRef.current.value,
      };

      if (dateOfBirthRef.current) {
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        const selectedDate = new Date(dateOfBirthRef.current.value);

        if (selectedDate >= eighteenYearsAgo) {
          dateOfBirthRef.current.min = eighteenYearsAgo
            .toISOString()
            .split("T")[0];
          setDateOfBirthError("");
        } else {
          setDateOfBirthError(
            "You must be at least 18 years old to create an account."
          );
        }
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/client/create-customer`,
        newCustomer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("New Customer Added Successfully");
      setShowModal(!showModal);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create customer"
      );
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!password.trim()) {
    //   setPasswordError("Password is required");
    // } else if (!passwordRegex.test(password)) {
    //   setPasswordError(
    //     "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    //   );
    // } else {
    setPasswordError("");
    // }
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^\d{10}$/;
    if (!mobile.trim()) {
      setMobileError("Mobile number is required");
    } else if (!mobileRegex.test(mobile)) {
      setMobileError("Invalid mobile number format");
    } else {
      setMobileError("");
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/\+|-/.test(keyValue)) event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the passed-in createCustomer function with the form data
    await createCustomer({
      name: nameRef.current.value,
      mobile: mobileRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      gender: genderRef.current.value,
      dateOfBirth: dateOfBirthRef.current.value,
      location: locationRef.current.value,
    });
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-2/3 max-h-full overflow-y-auto">
        <h3 className="text-2xl mb-4">Create New Customer</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                ref={nameRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
                onBlur={(e) => validateName(e.target.value)}
                onChange={(e) => validateName(e.target.value)}
              />
              {nameError && <p className="text-red-500">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Mobile:</label>
              <input
                type="text"
                ref={mobileRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
                onBlur={(e) => validateMobile(e.target.value)}
                onChange={(e) => validateMobile(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {mobileError && <p className="text-red-500">{mobileError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <div className="relative">
                <input
                  type={togglePassword ? "text" : "password"}
                  ref={passwordRef}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                  onBlur={(e) => validatePassword(e.target.value)}
                  onChange={(e) => validatePassword(e.target.value)}
                />
                <span
                  className="absolute bottom-2 right-2.5 cursor-pointer text-blue-500"
                  onClick={() => settogglePassword((prev) => !prev)}
                >
                  {togglePassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2">Gender:</label>
              <select
                ref={genderRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Date of Birth:</label>
              <input
                type="date"
                ref={dateOfBirthRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {dateOfBirthError && (
                <p className="text-red-500">{dateOfBirthError}</p>
              )}
            </div>
            <div className="mb-4 col-span-2">
              <label className="block mb-2">Location:</label>
              <input
                type="text"
                ref={locationRef}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              disabled={nameError || emailError || passwordError || mobileError}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerJSX;