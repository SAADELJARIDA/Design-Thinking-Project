// Format date to "12 Mars 2024" format
export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

// Format time to "14:30" format
export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('fr-FR', options);
};

// Format date and time together
export const formatDateTime = (date) => {
  return `${formatDate(date)} à ${formatTime(date)}`;
};

// Calculate countdown from now to event date/time
export const calculateCountdown = (eventDate) => {
  const now = new Date();
  const eventTime = new Date(eventDate);
  
  // If event is in the past, return null
  if (eventTime < now) {
    return null;
  }
  
  // Calculate time difference in milliseconds
  const diff = eventTime - now;
  
  // Convert to days, hours, minutes
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

// Get a formatted countdown string
export const getCountdownText = (eventDate) => {
  const countdown = calculateCountdown(eventDate);
  
  if (!countdown) {
    return "Événement terminé";
  }
  
  const { days, hours, minutes } = countdown;
  
  if (days > 0) {
    return `${days} jour${days > 1 ? 's' : ''} ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} heure${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}; 