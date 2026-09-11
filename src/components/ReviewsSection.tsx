import React, { useState } from 'react';
import { REAL_REVIEWS } from '../data/initialData';
import { Star, MessageCircle, CheckCircle2, User, ThumbsUp } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = filterRating
    ? REAL_REVIEWS.filter((r) => r.rating === filterRating)
    : REAL_REVIEWS;

  return (
    <div id="customer-reviews-section" className="max-w-6xl mx-auto space-y-6">
      {/* Review Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Verified Customer Experiences
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
            What Coimbatore Plumbers & Builders Say
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Authentic customer testimonials from contractors, local guides, and homeowners in Coimbatore.
          </p>
        </div>

        {/* Aggregate rating pill */}
        <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-neutral-950 font-mono">4.7</span>
            <div className="flex items-center text-amber-500 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
          <div className="border-l border-neutral-200 pl-4 text-xs">
            <strong className="text-neutral-900 block font-semibold">91 Google Reviews</strong>
            <span className="text-emerald-700 font-medium">96% Positive Feedback</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterRating(null)}
          className={`px-3.5 py-1.5 rounded-xl border transition-all ${
            filterRating === null
              ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          All Reviews ({REAL_REVIEWS.length})
        </button>
        <button
          onClick={() => setFilterRating(5)}
          className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
            filterRating === 5
              ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>5 Stars</span>
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Author & rating */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold text-xs">
                    {rev.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                      {rev.author}
                    </h4>
                    <span className="text-[11px] text-neutral-400">{rev.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-[10px] text-neutral-400 ml-1">{rev.timeAgo}</span>
                </div>
              </div>

              {/* Review content */}
              <p className="text-xs text-neutral-700 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            {/* Owner Response if present */}
            {rev.ownerResponse && (
              <div className="mt-3 pt-3 border-t border-neutral-100 bg-neutral-50/80 p-3 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-800 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Response from Burhani Hardware Mart</span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-normal">
                  {rev.ownerResponse}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
