import React from 'react';
import {
  Star,
} from 'lucide-react';

export function StarRating({ value, onChange, size = 24, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={readOnly ? 'star-row star-row-readonly' : 'star-row'} role={readOnly ? 'img' : 'radiogroup'} aria-label={`${value} out of 5 stars`}>
      {stars.map((n) => {
        const filled = n <= value;
        const StarIcon = (
          <Star
            size={size}
            strokeWidth={1.6}
            fill={filled ? '#F5B400' : 'transparent'}
            color={filled ? '#F5B400' : '#9AA8B8'}
          />
        );
        if (readOnly) {
          return <span key={n}>{StarIcon}</span>;
        }
        return (
          <button
            key={n}
            type="button"
            className="star-button"
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onClick={() => onChange(n)}
          >
            {StarIcon}
          </button>
        );
      })}
    </div>
  );
}
