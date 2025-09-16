import React from 'react';
import AlertsManager from '../components/AlertsManager';
import './AlertsPage.css';

const AlertsPage = () => {
  return (
    <div className="alerts-page">
      <h1 className="page-title">Manage Your Alerts</h1>
      <p className="page-subtitle">
        Set up and manage custom alerts to stay on top of market movements.
      </p>
      <div className="alerts-container">
        <AlertsManager />
      </div>
    </div>
  );
};

export default AlertsPage;
