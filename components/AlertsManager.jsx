import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an AuthContext
import { BellPlus, Trash2, Zap } from 'lucide-react';
import './AlertsManager.css';

const AlertsManager = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'price_above',
    value: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAlerts = useCallback(async () => {
    if (!user || !user.uid) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/alerts/user/${user.uid}`);
      setAlerts(response.data);
    } catch (err) {
      setError('Failed to fetch alerts.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      fetchAlerts();
    }
  }, [user, fetchAlerts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!user || !newAlert.symbol || !newAlert.value) {
      setError('All fields are required.');
      return;
    }
    setError('');
    try {
      const payload = { ...newAlert, userId: user.uid };
      const response = await axios.post('/api/alerts', payload);
      setAlerts(prev => [response.data, ...prev]);
      setNewAlert({ symbol: '', condition: 'price_above', value: '' });
    } catch (err) {
      setError('Failed to create alert.');
      console.error(err);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`/api/alerts/${alertId}`);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      setError('Failed to delete alert.');
      console.error(err);
    }
  };

  const conditionText = {
    price_above: 'Price Rises Above',
    price_below: 'Price Drops Below',
    percent_change_above: '% Change is Above'
  };

  return (
    <div className="alerts-manager">
      <h3 className="alerts-title"><Zap size={20} /> Alert Configuration</h3>
      
      <form onSubmit={handleAddAlert} className="alert-form">
        <input
          type="text"
          name="symbol"
          value={newAlert.symbol}
          onChange={handleInputChange}
          placeholder="Stock Symbol (e.g., IBM)"
          className="alert-input"
          required
        />
        <select 
          name="condition"
          value={newAlert.condition} 
          onChange={handleInputChange} 
          className="alert-select"
        >
          <option value="price_above">Price Rises Above</option>
          <option value="price_below">Price Drops Below</option>
          <option value="percent_change_above">% Change Is Above</option>
        </select>
        <input
          type="number"
          name="value"
          value={newAlert.value}
          onChange={handleInputChange}
          placeholder="Target Value"
          className="alert-input"
          required
        />
        <button type="submit" className="add-alert-btn">
          <BellPlus size={18} /> Add Alert
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <div className="alerts-list">
        {isLoading ? (
          <p>Loading alerts...</p>
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <div className="alert-details">
                <span className="alert-symbol">{alert.symbol}</span>
                <span className="alert-condition">{conditionText[alert.condition]}</span>
                <span className="alert-value">{alert.condition.includes('percent') ? `${alert.value}%` : `$${alert.value}`}</span>
              </div>
              <button onClick={() => handleDeleteAlert(alert.id)} className="delete-alert-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="no-alerts">You have no active alerts.</p>
        )}
      </div>
    </div>
  );
};

export default AlertsManager;
