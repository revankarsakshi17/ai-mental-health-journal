// Format date nicely
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Get emoji for emotion
export const getEmotionEmoji = (emotion) => {
  const map = {
    joy: '😄', sadness: '😢', anger: '😡',
    fear: '😨', surprise: '😮', disgust: '🤢',
    neutral: '😐', anxiety: '😰', gratitude: '🙏',
    love: '❤️', hope: '🌟', frustration: '😤',
  };
  return map[emotion] || '💭';
};

// Get color for emotion
export const getEmotionColor = (emotion) => {
  const map = {
    joy: '#FFD166', sadness: '#118AB2', anger: '#EF476F',
    fear: '#6A0572', surprise: '#06D6A0', disgust: '#8B5CF6',
    neutral: '#94A3B8', anxiety: '#F97316', gratitude: '#10B981',
    love: '#EC4899', hope: '#3B82F6', frustration: '#DC2626',
  };
  return map[emotion] || '#7c3aed';
};

// Get sentiment color
export const getSentimentColor = (label) => {
  const map = {
    Positive: '#16a34a',
    Neutral: '#6b7280',
    Negative: '#dc2626',
  };
  return map[label] || '#6b7280';
};

// Show error message
export const showError = (elementId, message) => {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
};

// Hide error message
export const hideError = (elementId) => {
  const el = document.getElementById(elementId);
  if (el) el.style.display = 'none';
};