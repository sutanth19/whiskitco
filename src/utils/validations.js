// src/utils/validations.js

export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhoneNumber = (phoneNumber) => {
  const re = /^[0-9]{10}$/; // Adjust the regex according to your phone number format requirement
  return re.test(String(phoneNumber));
};

export const validatePassword = (password) => {
  return password.length >= 6; // Minimum length requirement for password
};

export const validateName = (name) => {
  return name.trim().length > 0; // Ensure name is not blank
};
