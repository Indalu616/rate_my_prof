import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Star, MessageSquare, Heart, Trash2, Edit, Eye } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [favoriteProfessors, setFavoriteProfessors] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user reviews
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("userId", "==", currentUser.uid)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = [];

      for (const reviewDoc of reviewsSnapshot.docs) {
        const reviewData = reviewDoc.data();
        const professorDoc = await getDoc(
          doc(db, "professors", reviewData.professorId)
        );

        if (professorDoc.exists()) {
          reviewsData.push({
            id: reviewDoc.id,
            ...reviewData,
            professor: professorDoc.data(),
          });
        }
      }

      setUserReviews(reviewsData);

      // Fetch favorite professors
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.favoriteProfessors) {
          const favoritesData = [];
          for (const professorId of userData.favoriteProfessors) {
            const professorDoc = await getDoc(
              doc(db, "professors", professorId)
            );
            if (professorDoc.exists()) {
              favoritesData.push({
                id: professorDoc.id,
                ...professorDoc.data(),
              });
            }
          }
          setFavoriteProfessors(favoritesData);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", reviewId));
        setUserReviews(userReviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleToggleFavorite = async (professorId) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const isFavorite = favoriteProfessors.some((p) => p.id === professorId);

      if (isFavorite) {
        await updateDoc(userRef, {
          favoriteProfessors: arrayRemove(professorId),
        });
        setFavoriteProfessors(
          favoriteProfessors.filter((p) => p.id !== professorId)
        );
      } else {
        await updateDoc(userRef, {
          favoriteProfessors: arrayUnion(professorId),
        });
        const professorDoc = await getDoc(doc(db, "professors", professorId));
        if (professorDoc.exists()) {
          setFavoriteProfessors([
            ...favoriteProfessors,
            {
              id: professorDoc.id,
              ...professorDoc.data(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const tabs = [
    {
      id: "reviews",
      name: "My Reviews",
      icon: MessageSquare,
      count: userReviews.length,
    },
    {
      id: "favorites",
      name: "Saved Professors",
      icon: Heart,
      count: favoriteProfessors.length,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-slate-800">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your reviews and favorite professors
          </p>
        </div>

        {/* Stats */}
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-lg font-medium text-slate-800">
              {userReviews.length}
            </div>
            <div className="text-xs text-slate-500">Total Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-slate-800">
              {favoriteProfessors.length}
            </div>
            <div className="text-xs text-slate-500">Saved Professors</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "reviews" && (
        <div className="card-elevated">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-800">My Reviews</h3>
          </div>

          {userReviews.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                No reviews yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Start reviewing professors and add them to your favorites for
                quick access
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Professor</th>
                    <th className="table-head">Rating</th>
                    <th className="table-head">Comment</th>
                    <th className="table-head">Course</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {userReviews.map((review) => (
                    <tr key={review.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-700">
                              {review.professor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {review.professor.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {review.professor.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                          <span className="text-sm text-slate-700">
                            {review.rating}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell text-sm text-slate-600">
                        {review.comment ? (
                          <div
                            className="max-w-xs truncate"
                            title={review.comment}
                          >
                            {review.comment}
                          </div>
                        ) : (
                          <span className="text-slate-400">No comment</span>
                        )}
                      </td>
                      <td className="table-cell text-sm text-slate-600">
                        {review.course || "N/A"}
                      </td>
                      <td className="table-cell text-sm font-medium space-x-1">
                        <button
                          onClick={() =>
                            handleToggleFavorite(review.professorId)
                          }
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            favoriteProfessors.some(
                              (p) => p.id === review.professorId
                            )
                              ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                              : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Heart className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="card-elevated">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-800">
              Saved Professors
            </h3>
          </div>

          {favoriteProfessors.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-slate-600 mb-1">
                No saved professors
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Start reviewing professors and add them to your favorites for
                quick access
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Professor</th>
                    <th className="table-head">Department</th>
                    <th className="table-head">Rating</th>
                    <th className="table-head">Reviews</th>
                    <th className="table-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {favoriteProfessors.map((professor) => (
                    <tr key={professor.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-700">
                              {professor.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-slate-800">
                            {professor.name}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-sm text-slate-600">
                        {professor.department}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                          <span className="text-sm text-slate-700">
                            {professor.averageRating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell text-sm text-slate-600">
                        {professor.totalReviews || 0}
                      </td>
                      <td className="table-cell text-sm font-medium space-x-1">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(professor.id)}
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
