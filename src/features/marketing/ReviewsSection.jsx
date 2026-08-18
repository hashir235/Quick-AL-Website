import React from 'react';
import {
  MessageSquare,
  Send,
  Server,
} from 'lucide-react';
import { Reveal } from '../../components/Reveal.jsx';
import { StarRating } from '../../components/StarRating.jsx';
import { apiBaseUrl } from '../../lib/site.js';

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);

  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reviews`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      setLoadError('Could not load reviews right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (trimmedName.length < 2) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setSubmitError('Please write at least a short review (10+ characters).');
      return;
    }
    if (rating < 1 || rating > 5) {
      setSubmitError('Please choose a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          city: city.trim(),
          rating,
          message: trimmedMessage,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded ${res.status}`);
      }
      setSubmitSuccess(true);
      setName('');
      setCity('');
      setRating(5);
      setMessage('');
    } catch (err) {
      setSubmitError(err.message || 'Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="section reviews-section" id="reviews">
      <Reveal className="section-heading">
        <p className="eyebrow">
          <MessageSquare size={16} /> Reviews
        </p>
        <h2>What users say about Quick AL</h2>
        <p>
          Real feedback from aluminium and glass shops using Quick AL.
          {averageRating && (
            <>
              {' '}
              Current average rating:{' '}
              <strong style={{ color: '#F5B400' }}>{averageRating} / 5</strong>{' '}
              ({reviews.length} review{reviews.length === 1 ? '' : 's'}).
            </>
          )}
        </p>
      </Reveal>

      <div className="reviews-grid">
        {loading && <p className="reviews-empty">Loading reviews…</p>}
        {!loading && loadError && <p className="reviews-empty">{loadError}</p>}
        {!loading && !loadError && reviews.length === 0 && (
          <p className="reviews-empty">
            No reviews yet — be the first to share your experience below.
          </p>
        )}
        {!loading &&
          !loadError &&
          reviews.map((review) => (
            <article className="review-card glass-card" key={review.id}>
              <StarRating value={Number(review.rating || 0)} readOnly size={18} />
              <p className="review-message">"{review.message}"</p>
              <div className="review-meta">
                <strong>{review.name}</strong>
                {review.city && <span> · {review.city}</span>}
              </div>
            </article>
          ))}
      </div>

      <form className="review-form glass-card" onSubmit={handleSubmit}>
        <h3>Share your experience</h3>
        <p className="review-form-hint">
          Your review will appear on this page after a quick moderation check.
        </p>

        <label className="review-field">
          <span>Your name</span>
          <input
            type="text"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ahmed Hassan"
            required
          />
        </label>

        <label className="review-field">
          <span>City (optional)</span>
          <input
            type="text"
            value={city}
            maxLength={40}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Lahore"
          />
        </label>

        <div className="review-field">
          <span>Your rating</span>
          <StarRating value={rating} onChange={setRating} size={30} />
        </div>

        <label className="review-field">
          <span>Your review</span>
          <textarea
            value={message}
            maxLength={500}
            rows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell other shops what you liked or what could be better…"
            required
          />
          <small className="review-counter">{message.length}/500</small>
        </label>

        {submitError && <p className="review-error">{submitError}</p>}
        {submitSuccess && (
          <p className="review-success">
            Thank you! Your review has been received and will appear after a quick review.
          </p>
        )}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : (
            <>
              Submit Review
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
