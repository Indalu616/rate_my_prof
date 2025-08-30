import { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  BookOpen,
  User,
  MessageSquare,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const ReviewCard = ({ review, onVote, currentUserId }) => {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (voteType) => {
    if (!currentUserId || hasVoted) return;

    onVote(review.id, voteType);
    setHasVoted(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderRatingBreakdown = () => {
    const categories = [
      { key: "teachingQuality", label: "Teaching Quality", icon: "🎯" },
      { key: "clarity", label: "Clarity", icon: "💡" },
      { key: "helpfulness", label: "Helpfulness", icon: "🤝" },
      { key: "fairness", label: "Fairness", icon: "⚖️" },
      { key: "workload", label: "Workload", icon: "📚" },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map(({ key, label, icon }) => (
          <div key={key} className="text-center group">
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Star
                className={`h-3 w-3 ${
                  review.ratings[key] >= 4
                    ? "text-green-500"
                    : review.ratings[key] >= 3
                    ? "text-yellow-500"
                    : "text-red-500"
                } fill-current`}
              />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {review.ratings[key]}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 dark:text-green-400";
    if (rating >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3) return "Fair";
    if (rating >= 2) return "Poor";
    return "Very Poor";
  };

  const getRatingBadgeColor = (rating) => {
    if (rating >= 4)
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800";
    if (rating >= 3)
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group">
      {/* Review Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl shadow-sm">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                {review.userName}
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{review.course}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-3xl font-bold ${getRatingColor(
              review.averageRating
            )} mb-2`}
          >
            {review.averageRating.toFixed(1)}
          </div>
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getRatingBadgeColor(
              review.averageRating
            )} mb-2`}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{getRatingLabel(review.averageRating)}</span>
          </div>
          {renderStars(review.averageRating)}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm">
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center flex items-center justify-center space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <span>Detailed Ratings</span>
        </h5>
        {renderRatingBreakdown()}
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-l-4 border-blue-500 shadow-sm">
          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Student's Comment:
              </h6>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "{review.comment}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vote Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote("upvotes")}
            disabled={!currentUserId || hasVoted}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
              !currentUserId || hasVoted
                ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 hover:scale-105 shadow-sm"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="font-semibold">{review.upvotes || 0}</span>
          </button>

          <button
            onClick={() => handleVote("downvotes")}
            disabled={!currentUserId || hasVoted}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
              !currentUserId || hasVoted
                ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 hover:scale-105 shadow-sm"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="font-semibold">{review.downvotes || 0}</span>
          </button>
        </div>

        {!currentUserId && (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Sign in to vote on reviews</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
