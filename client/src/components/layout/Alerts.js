import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  // Determine alert styles based on type
  const getAlertStyles = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return 'fas fa-exclamation-circle';
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {alerts.length > 0 &&
        alerts.map(alert => (
          <div
            key={alert.id}
            className={`${getAlertStyles(alert.type)} px-4 py-3 rounded-md border relative`}
            role="alert"
          >
            <div className="flex items-center">
              <i className={`${getAlertIcon(alert.type)} mr-2`}></i>
              <span>{alert.msg}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Alerts; 