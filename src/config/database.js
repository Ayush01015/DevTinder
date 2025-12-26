const mongoose = require("mongoose");
const User = require("../models/user.js");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ayush625:ayush575@cluster0.cfykzkw.mongodb.net/devTinder"
  );
};

const runDataGen = async () => {
  try {
    const users = [];

    const firstNames = [
      "Aarav",
      "Vivaan",
      "Aditya",
      "Vihaan",
      "Arjun",
      "Sai",
      "Reyansh",
      "Ayaan",
      "Krishna",
      "Ishaan",
      "Diya",
      "Saanvi",
      "Ananya",
      "Aadhya",
      "Pari",
      "Kiara",
      "Riya",
      "Myra",
      "Sarah",
      "David",
      "John",
      "Emily",
      "Michael",
      "Emma",
      "Daniel",
      "Olivia",
      "James",
      "Sophia",
    ];

    const lastNames = [
      "Patel",
      "Sharma",
      "Singh",
      "Kumar",
      "Gupta",
      "Verma",
      "Mehta",
      "Jain",
      "Nair",
      "Reddy",
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
    ];

    const skillsPool = [
      "JavaScript",
      "Node.js",
      "React",
      "Angular",
      "MongoDB",
      "SQL",
      "Python",
      "Java",
      "C++",
      "AWS",
      "Docker",
      "System Design",
      "DevOps",
      "TypeScript",
      "Rust",
    ];

    const aboutPool = [
      "Full stack developer loving the MERN stack.",
      "Frontend wizard and UI/UX enthusiast.",
      "Backend engineer focused on scalable systems.",
      "Coding is my passion, coffee is my fuel.",
      "Looking for a coding buddy to build side projects.",
      "Open source contributor and tech blogger.",
      "Learning every day. Currently exploring AI.",
      "Passionate about clean code and architecture.",
    ];

    for (let i = 0; i < 100; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];

      const emailDomain = i % 2 === 0 ? "gmail.com" : "yahoo.com";
      const uniqueNum = Math.floor(Math.random() * 9999);
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${uniqueNum}@${emailDomain}`;

      const userSkills = [];
      const numberOfSkills = Math.floor(Math.random() * 3) + 2; // 2 to 4 skills
      for (let j = 0; j < numberOfSkills; j++) {
        const skill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
        if (!userSkills.includes(skill)) userSkills.push(skill);
      }

      const gender = ["male", "female", "others"][
        Math.floor(Math.random() * 3)
      ];

      users.push({
        firstName: fName,
        lastName: lName,
        email: email,
        password:
          "$2b$10$jWJ0W8ko9s./uvv3uaunz.tSQk9oFxkZk/yJbomlQHgMxbvn.SXhC", // Same hash for everyone
        age: Math.floor(Math.random() * (60 - 18) + 18), // Age 18 to 60
        gender: gender,
        about: aboutPool[Math.floor(Math.random() * aboutPool.length)],
        skills: userSkills,
        avatar: "https://geographyandyou.com/images/user-profile.png",
      });
    }

    await User.insertMany(users);
    console.log("SUCCESS: 100 Realistic Users have been added!");
  } catch (err) {
    console.error(" Error inserting data:", err.message);
  } finally {
    mongoose.connection.close();
    console.log("Connection Closed.");
  }
};

module.exports = connectDB;
