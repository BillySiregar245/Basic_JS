const { admitStudent } = require("./admissions");
const Student = require("../models/studentModel");

const students = new Map();
const tests = new Map();

const reloadData = async () => {
    try {
        students.clear();
        tests.clear();

        const studentData = await Student.find(); 
        studentData.forEach(student => students.set(student._id.toString(), student));

        console.log("Data mahasiswa berhasil dimuat ulang.");
    } catch (error) {
        console.error("Gagal memuat data mahasiswa:", error.message);
    }
};


reloadData();

module.exports = { students, tests, reloadData };
