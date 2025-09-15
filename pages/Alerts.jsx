import React from 'react';
import { Bell, AlertCircle, Plus, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const alerts = [
  { id: 1, keyword: 'Artificial Intelligence', frequency: 'Daily', created: '2023-10-26' },
  { id: 2, keyword: 'Quantum Computing', frequency: 'Weekly', created: '2023-10-20' },
  { id: 3, keyword: 'Sustainable Energy', frequency: 'Daily', created: '2023-09-15' },
];

const Alerts = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Bell className="mr-3 text-blue-400" />
            Manage Alerts
          </h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Create New Alert</h2>
                 <Button variant="solid" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Alert
                </Button>
            </div>
          <p className="text-gray-400 mt-2">Get notified when new trends match your criteria.</p>
        </div>

        <div className="bg-gray-800 rounded-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Active Alerts</h2>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">{alert.keyword}</p>
                    <p className="text-sm text-gray-400">
                      Frequency: {alert.frequency} | Created: {alert.created}
                    </p>
                  </div>
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="mx-auto w-12 h-12 mb-2" />
                  <p>You have no active alerts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
