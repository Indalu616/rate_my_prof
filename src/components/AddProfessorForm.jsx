import { useState } from "react";
import {
  X,
  Plus,
  BookOpen,
  MapPin,
  User,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";

const AddProfessorForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    courses: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Economics",
    "Psychology",
    "History",
    "English",
    "Philosophy",
    "Art",
    "Music",
    "Physical Education",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCourseChange = (index, value) => {
    const newCourses = [...formData.courses];
    newCourses[index] = value;
    setFormData((prev) => ({
      ...prev,
      courses: newCourses,
    }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, ""],
    }));
  };

  const removeCourse = (index) => {
    if (formData.courses.length > 1) {
      const newCourses = formData.courses.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        courses: newCourses,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Filter out empty courses
      const filteredCourses = formData.courses.filter((course) =>
        course.trim()
      );

      if (filteredCourses.length === 0) {
        setError("Please add at least one course");
        setLoading(false);
        return;
      }

      const professorData = {
        name: formData.name.trim(),
        department: formData.department,
        courses: filteredCourses,
        averageRating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        createdBy: "user",
      };

      await addDoc(collection(db, "professors"), professorData);

      // Reset form
      setFormData({
        name: "",
        department: "",
        courses: [""],
      });

      onSuccess();
    } catch (error) {
      console.error("Error adding professor:", error);
      setError("Failed to add professor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="card-elevated rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Add New Professor
                </h2>
                <p className="text-slate-600 mt-1">
                  Help other students by adding a professor to our database
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Professor Name */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Professor Name</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter professor's full name"
              required
              className="input w-full pl-12 text-lg"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Department</span>
              </div>
            </label>
            <div className="relative">
              <select
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                required
                className="input w-full pl-12 text-lg appearance-none"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400"></div>
              </div>
            </div>
          </div>

          {/* Courses */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Courses Taught</span>
              </div>
            </label>
            <div className="space-y-3">
              {formData.courses.map((course, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => handleCourseChange(index, e.target.value)}
                    placeholder={`Course ${index + 1}`}
                    className="input flex-1"
                  />
                  {formData.courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCourse}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all duration-200 font-medium border-2 border-dashed border-slate-300 hover:border-slate-400 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Another Course</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-2 text-red-600">
                <X className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 px-8 py-4 text-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Professor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Add Professor</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfessorForm;
