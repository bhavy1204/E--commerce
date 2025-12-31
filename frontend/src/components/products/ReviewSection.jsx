import React, { useEffect, useState } from "react";
import { apiClient } from "../../utils/api";

export const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchEligibility();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.getReviews(productId, {
        page,
        limit: 5,
      });
      setReviews(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibility = async () => {
    try {
      const res = await apiClient.checkReviewEligibility(productId);
      setEligibility({
        canReview: res.canReview,
        alreadyReviewed: res.alreadyReviewed,
      });
    } catch {
      setEligibility({ canReview: false, alreadyReviewed: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await apiClient.addReview(productId, { rating, comment });
      setComment("");
      setRating(5);
      setPage(1);
      await fetchReviews();
      await fetchEligibility();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading reviews...</div>;
  }

  console.log("REVIEW ELIGIBILITY 👉", eligibility);


  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>

      {/* ADD REVIEW FORM */}
      {eligibility?.canReview && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-gray-50 p-4 rounded-md"
        >
          <h4 className="font-semibold mb-3">Add a Review</h4>

          <label className="block mb-2 font-medium">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded px-3 py-2 mb-4"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && "s"}
              </option>
            ))}
          </select>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your honest review..."
            className="w-full border rounded px-3 py-2 mb-3"
            rows={4}
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* REVIEWS LIST */}
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-md p-4">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{review.user.firstName}</span>
                <span className="text-sm text-gray-500">{review.rating}★</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
