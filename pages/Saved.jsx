import React from 'react';
import { Bookmark, Eye, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const savedItems = [
  { id: 1, title: 'The Rise of AI in Creative Industries', type: 'Trend', savedAt: '2023-11-10' },
  { id: 2, title: 'Exploring the Metaverse: A Deep Dive', type: 'Report', savedAt: '2023-11-08' },
  { id: 3, title: 'Sustainable Tech Innovations', type: 'Trend', savedAt: '2023-11-05' },
];

const Saved = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="mr-3 text-blue-400" />
            Saved Items
          </h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Saved Trends & Reports</h2>
            <div className="space-y-4">
              {savedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-sm text-gray-400">
                      Type: {item.type} | Saved on: {item.savedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="danger" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {savedItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Bookmark className="mx-auto w-12 h-12 mb-2" />
                  <p>You haven't saved any items yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
