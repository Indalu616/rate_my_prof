// Sample data script for RateMyProf
// Run this in your Firebase console or use it as a reference

const sampleProfessors = [
  {
    name: "Dr. Sarah Johnson",
    department: "Computer Science",
    courses: [
      "CS 101 - Introduction to Programming",
      "CS 201 - Data Structures",
      "CS 301 - Algorithms",
    ],
    email: "sarah.johnson@university.edu",
    averageRating: 4.8,
    reviewCount: 45,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Prof. Michael Chen",
    department: "Mathematics",
    courses: [
      "MATH 101 - Calculus I",
      "MATH 201 - Calculus II",
      "MATH 301 - Linear Algebra",
    ],
    email: "michael.chen@university.edu",
    averageRating: 4.6,
    reviewCount: 38,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Dr. Emily Rodriguez",
    department: "Physics",
    courses: [
      "PHYS 101 - General Physics I",
      "PHYS 201 - General Physics II",
      "PHYS 301 - Modern Physics",
    ],
    email: "emily.rodriguez@university.edu",
    averageRating: 4.9,
    reviewCount: 52,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Prof. David Thompson",
    department: "Business",
    courses: [
      "BUS 101 - Introduction to Business",
      "BUS 201 - Marketing Principles",
      "BUS 301 - Strategic Management",
    ],
    email: "david.thompson@university.edu",
    averageRating: 4.4,
    reviewCount: 29,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Dr. Lisa Wang",
    department: "Psychology",
    courses: [
      "PSYCH 101 - Introduction to Psychology",
      "PSYCH 201 - Developmental Psychology",
      "PSYCH 301 - Cognitive Psychology",
    ],
    email: "lisa.wang@university.edu",
    averageRating: 4.7,
    reviewCount: 41,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Prof. James Wilson",
    department: "Engineering",
    courses: [
      "ENG 101 - Engineering Fundamentals",
      "ENG 201 - Statics and Dynamics",
      "ENG 301 - Thermodynamics",
    ],
    email: "james.wilson@university.edu",
    averageRating: 4.5,
    reviewCount: 33,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Dr. Maria Garcia",
    department: "Chemistry",
    courses: [
      "CHEM 101 - General Chemistry I",
      "CHEM 201 - General Chemistry II",
      "CHEM 301 - Organic Chemistry",
    ],
    email: "maria.garcia@university.edu",
    averageRating: 4.3,
    reviewCount: 27,
    createdAt: new Date().toISOString(),
  },
  {
    name: "Prof. Robert Kim",
    department: "Economics",
    courses: [
      "ECON 101 - Principles of Microeconomics",
      "ECON 201 - Principles of Macroeconomics",
      "ECON 301 - Econometrics",
    ],
    email: "robert.kim@university.edu",
    averageRating: 4.6,
    reviewCount: 35,
    createdAt: new Date().toISOString(),
  },
];

const sampleReviews = [
  {
    professorId: "professor1", // Replace with actual professor ID
    userId: "user1", // Replace with actual user ID
    userName: "Student A",
    course: "CS 101 - Introduction to Programming",
    ratings: {
      teachingQuality: 5,
      clarity: 5,
      helpfulness: 4,
      fairness: 5,
      workload: 4,
    },
    averageRating: 4.6,
    comment:
      "Excellent professor! Very clear explanations and always available for help. The course was challenging but fair.",
    createdAt: new Date().toISOString(),
    upvotes: 12,
    downvotes: 0,
  },
  {
    professorId: "professor1",
    userId: "user2",
    userName: "Student B",
    course: "CS 201 - Data Structures",
    ratings: {
      teachingQuality: 5,
      clarity: 4,
      helpfulness: 5,
      fairness: 5,
      workload: 3,
    },
    averageRating: 4.4,
    comment:
      "Great course on data structures. Professor Johnson makes complex topics easy to understand.",
    createdAt: new Date().toISOString(),
    upvotes: 8,
    downvotes: 1,
  },
];

// Sample admin user
const adminUser = {
  uid: "admin123", // Replace with actual UID
  email: "admin@university.edu",
  displayName: "Admin User",
  role: "admin",
  createdAt: new Date().toISOString(),
  favoriteProfessors: [],
  reviews: [],
};

// Instructions for using this data:
// 1. Replace placeholder IDs with actual Firebase document IDs
// 2. Run this in Firebase console or use as reference for manual data entry
// 3. Ensure Firestore security rules allow this data to be written
// 4. Update professor IDs in reviews to match actual professor documents

console.log("Sample data ready for import");
console.log("Professors:", sampleProfessors);
console.log("Reviews:", sampleReviews);
console.log("Admin User:", adminUser);


