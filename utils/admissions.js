const Student = require('../models/studentModel'); 

const admitStudent = async (name, email) => {
  try {
    
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      throw new Error("Email already registered.");
    }

    
    if (!email.endsWith('@univ.edu')) {
      throw new Error("Email must end with @univ.edu.");
    }

    
    const existingName = await Student.findOne({ name });
    if (existingName) {
      throw new Error("Name already exists.");
    }

    
    const newStudent = new Student({ name, email });
    await newStudent.save();

    return newStudent;
  } catch (error) {
    throw error;
  }
};

module.exports = { admitStudent };
