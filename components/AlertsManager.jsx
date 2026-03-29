/**
 * AlertsManager - Migrated to TanStack Query
 * Uses useAlerts, useCreateAlert, useDeleteAlert hooks
 */

import React, { useState, useRef } from 'react';
import { useAlerts, useCreateAlert, useDeleteAlert } from '../hooks/useAlerts';
import { BellPlus, Trash2, Zap, Loader2 } from 'lucide-react';
import EmptyState from './EmptyState';
import './AlertsManager.css';

const AlertsManager = () => {
  const { data: alerts = [], isLoading, error } = useAlerts();
  const createAlert = useCreateAlert();
  const deleteAlert = useDeleteAlert();
  
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'price_above',
    value: ''
  });
  const [formError, setFormError] = useState('');
  const symbolInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({ ...prev, [name]: value }));
  };

  const handleFocusInput = () => {
    symbolInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.symbol || !newAlert.value) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    
    try {
      await createAlert.mutateAsync(newAlert);
      setNewAlert({ symbol: '', condition: 'price_above', value: '' });
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await deleteAlert.mutateAsync(alertId);
    } catch (err) {
      console.error('Failed to delete alert:', err);
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
          ref={symbolInputRef}
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
        <button 
          type="submit" 
          className="add-alert-btn"
          disabled={createAlert.isPending}
        >
          {createAlert.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <BellPlus size={18} />
          )}
          {createAlert.isPending ? 'Adding...' : 'Add Alert'}
        </button>
      </form>

      {formError && <p className="text-red-400 text-sm mt-2">{formError}</p>}
      
      <div className="alerts-list">
        {isLoading ? (
          <div className="flex justify-center p-8 text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Scanning frequency...
          </div>
        ) : alerts.length > 0 ? (
          alerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <div className="alert-details">
                <span className="alert-symbol">{alert.symbol}</span>
                <span className="alert-condition">{conditionText[alert.condition]}</span>
                <span className="alert-value">
                  {alert.condition.includes('percent') ? `${alert.value}%` : `$${alert.value}`}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteAlert(alert.id)} 
                className="delete-alert-btn"
                disabled={deleteAlert.isPending}
              >
                {deleteAlert.isPending && deleteAlert.variables === alert.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          ))
        ) : (
          <EmptyState 
            message="No signals detected yet"
            description="Your trend alerts will appear here once activity begins. Define your signal parameters above."
            actionLabel="Create Alert"
            onAction={handleFocusInput}
          />
        )}
      </div>
    </div>
  );
};

export default AlertsManager;
