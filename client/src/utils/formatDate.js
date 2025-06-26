// Format date to French style (e.g., "12 Mars 2024")
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}; 