import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  Star,
  MapPin,
  BookOpen,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Heart,
  Share2,
  Plus,
  TrendingUp,
  Award,
  ArrowLeft,
  Users,
  Clock,
} from "lucide-react";
import RatingForm from "../components/RatingForm";
import ReviewCard from "../components/ReviewCard";
import AddProfessorForm from "../components/AddProfessorForm";

const ProfessorDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showAddProfessor, setShowAddProfessor] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        // Fetch professor data
        const professorDoc = await getDoc(doc(db, "professors", id));
        if (professorDoc.exists()) {
          setProfessor({ id: professorDoc.id, ...professorDoc.data() });
        }

        // Fetch reviews
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          const review = { id: doc.id, ...doc.data() };
          if (review.professorId === id) {
            reviewsData.push(review);
          }
        });

        setReviews(reviewsData);

        // Check if user has already reviewed this professor
        if (currentUser) {
          const userReview = reviewsData.find(
            (review) => review.userId === currentUser.uid
          );
          setUserReview(userReview);
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorData();
  }, [id, currentUser]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.averageRating,
      0
    );
    return totalRating / reviews.length;
  };

  const updateProfessorRating = async (newReview) => {
    try {
      const batch = writeBatch(db);

      // Add the new review
      const reviewRef = doc(collection(db, "reviews"));
      batch.set(reviewRef, newReview);

      // Update professor's review count and average rating
      const professorRef = doc(db, "professors", id);
      const updatedReviews = [...reviews, newReview];
      const newAverageRating = calculateAverageRating(updatedReviews);

      batch.update(professorRef, {
        reviewCount: increment(1),
        averageRating: newAverageRating,
      });

      await batch.commit();

      // Update local state
      setReviews((prev) => [newReview, ...prev]);
      setProfessor((prev) => ({
        ...prev,
        reviewCount: (prev.reviewCount || 0) + 1,
        averageRating: newAverageRating,
      }));
      setUserReview(newReview);
    } catch (error) {
      console.error("Error updating professor rating:", error);
      throw error;
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const newReview = {
        ...reviewData,
        professorId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Anonymous",
        createdAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      };

      await updateProfessorRating(newReview);
      setShowRatingForm(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleVote = async (reviewId, voteType) => {
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, {
        [voteType]: increment(1),
      });

      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, [voteType]: review[voteType] + 1 }
            : review
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleAddProfessorSuccess = () => {
    // Navigate to the new professor's page
    navigate(`/professors/${professor.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse border border-gray-200 dark:border-gray-700">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Award className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Professor Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            This professor doesn't exist in our database yet. Would you like to
            add them?
          </p>
          <div className="space-y-4">
            {currentUser && (
              <button
                onClick={() => setShowAddProfessor(true)}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Add This Professor</span>
              </button>
            )}
            <Link
              to="/professors"
              className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Professors</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = professor.averageRating || 0;
  const reviewCount = professor.reviewCount || 0;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Link
          to="/professors"
          className="inline-flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Professors</span>
        </Link>
      </div>

      {/* Professor Header */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl shadow-lg">
                <Award className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {professor.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      / 5.0
                    </span>
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400">
                    ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    Department
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {professor.department}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    Courses
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {professor.courses?.length || 0} courses
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    Rating
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {averageRating.toFixed(1)} / 5.0
                  </div>
                </div>
              </div>
            </div>

            {professor.courses && professor.courses.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span>Courses Taught</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {professor.courses.map((course, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800 shadow-sm"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 lg:mt-0 lg:ml-8 space-y-4 w-full lg:w-auto">
            {currentUser && !userReview && (
              <button
                onClick={() => setShowRatingForm(true)}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Rate This Professor</span>
              </button>
            )}

            <div className="flex flex-col sm:flex-row lg:flex-col space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-3">
              <button className="flex-1 lg:flex-none px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Favorite</span>
              </button>
              <button className="flex-1 lg:flex-none px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && (
        <RatingForm
          onSubmit={handleReviewSubmit}
          onClose={() => setShowRatingForm(false)}
          professorName={professor.name}
        />
      )}

      {/* Add Professor Modal */}
      {showAddProfessor && (
        <AddProfessorForm
          onClose={() => setShowAddProfessor(false)}
          onSuccess={handleAddProfessorSuccess}
        />
      )}

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <span>Student Reviews</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>
                {reviewCount} review{reviewCount !== 1 ? "s" : ""} from students
              </span>
            </p>
          </div>
          {currentUser && !userReview && (
            <button
              onClick={() => setShowRatingForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Star className="h-5 w-5" />
              <span>Write a Review</span>
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to review this professor!
            </p>
            {currentUser && (
              <button
                onClick={() => setShowRatingForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <Star className="h-5 w-5" />
                <span>Write the First Review</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onVote={handleVote}
                currentUserId={currentUser?.uid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDetail;
