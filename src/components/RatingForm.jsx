import { useState } from "react";
import {
  X,
  Star,
  Sparkles,
  MessageSquare,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";

const RatingForm = ({ onSubmit, onClose, professorName }) => {
  const [ratings, setRatings] = useState({
    teachingQuality: 0,
    clarity: 0,
    helpfulness: 0,
    fairness: 0,
    workload: 0,
  });
  const [comment, setComment] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState({});

  const handleRatingChange = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all ratings are provided
    const allRated = Object.values(ratings).every((rating) => rating > 0);
    if (!allRated) {
      alert("Please rate all categories");
      return;
    }

    if (!course.trim()) {
      alert("Please specify which course you took");
      return;
    }

    try {
      setLoading(true);
      const averageRating =
        Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / 5;

      await onSubmit({
        ratings,
        averageRating,
        comment: comment.trim(),
        course: course.trim(),
      });

      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (category, value) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            onMouseEnter={() =>
              setHoveredRating({ ...hoveredRating, [category]: star })
            }
            onMouseLeave={() =>
              setHoveredRating({ ...hoveredRating, [category]: 0 })
            }
            className={`p-1 transition-all duration-200 hover:scale-110 ${
              star <= (hoveredRating[category] || value)
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-slate-300 hover:text-slate-400"
            }`}
          >
            <Star
              className={`h-7 w-7 ${
                star <= (hoveredRating[category] || value) ? "fill-current" : ""
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingDescription = (value) => {
    if (value === 0) return "Not rated";
    if (value === 1) return "Poor";
    if (value === 2) return "Fair";
    if (value === 3) return "Good";
    if (value === 4) return "Very Good";
    if (value === 5) return "Excellent";
    return "";
  };

  const getRatingColor = (value) => {
    if (value === 0) return "text-slate-400";
    if (value <= 2) return "text-red-600";
    if (value === 3) return "text-yellow-600";
    if (value >= 4) return "text-green-600";
    return "text-slate-400";
  };

  const getRatingBadgeColor = (value) => {
    if (value === 0)
      return "bg-slate-100 text-slate-600 border border-slate-200";
    if (value <= 2) return "bg-red-100 text-red-700 border border-red-200";
    if (value === 3)
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    if (value >= 4)
      return "bg-green-100 text-green-700 border border-green-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card-elevated rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-2xl shadow-lg">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Rate {professorName}
                </h2>
                <p className="text-slate-600 text-sm">
                  Help other students make informed decisions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-xl"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-800">
                Course Taken *
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g., CS 101 - Introduction to Computer Science"
                  className="input w-full pl-12 text-lg"
                  required
                />
              </div>
            </div>

            {/* Rating Categories */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-slate-800">
                  Rate the following aspects (1-5 stars):
                </h3>
              </div>

              {Object.entries(ratings).map(([category, value]) => (
                <div
                  key={category}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <label className="block text-lg font-semibold text-slate-800 mb-2">
                        {category === "teachingQuality" && "Teaching Quality"}
                        {category === "clarity" && "Clarity of Explanations"}
                        {category === "helpfulness" &&
                          "Helpfulness & Availability"}
                        {category === "fairness" && "Fairness in Grading"}
                        {category === "workload" && "Reasonable Workload"}
                      </label>
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getRatingBadgeColor(
                          value
                        )}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{getRatingDescription(value)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-800">
                        {value > 0 ? value : "-"}
                      </div>
                      <div className="text-xs text-slate-500">stars</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {renderStars(category, value)}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-800">
                Additional Comments (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-slate-400 h-5 w-5" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience, tips for other students, or any additional thoughts..."
                  rows={5}
                  className="input w-full pl-12 text-lg resize-none"
                />
              </div>
              <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                💡 Your review will help other students make informed decisions
                about their course selection.
              </div>
            </div>

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
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Submit Review</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
