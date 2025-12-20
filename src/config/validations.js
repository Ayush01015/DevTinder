const validator = require('validator');


const validateUser = (req) => {
  const {firstName, lastName, email ,password, age, gender} = req.body;
  if(!firstName || !lastName){
    throw new Error("Please enter valid name");
  }else if(!email || !validator.isEmail(email)){
    throw new Error("Pleas enter valid email");
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password");
  }
}

const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

module.exports = { isEmpty, validateUser };