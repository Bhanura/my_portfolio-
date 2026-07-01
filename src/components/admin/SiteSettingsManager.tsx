'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings } from 'lucide-react';

type SiteSetting = {
  id: number;
  section: string;
  content: any;
};

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('section');
    if (!error && data) setSettings(data);
  };

  const handleEdit = (setting: SiteSetting) => {
    setSelectedSection(setting.section);
    setEditContent(JSON.stringify(setting.content, null, 2));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const parsedContent = JSON.parse(editContent);
      const { error } = await supabase
        .from('site_settings')
        .update({ content: parsedContent, updated_at: new Date().toISOString() })
        .eq('section', selectedSection);
      
      if (!error) {
        setSelectedSection('');
        setEditContent('');
        fetchSettings();
        alert('Settings updated successfully!');
      } else {
        alert('Error updating settings');
      }
    } catch (e) {
      alert('Invalid JSON format');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Settings size={24} />
        <h2 className="text-xl font-semibold">Site Settings</h2>
      </div>

      {selectedSection ? (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold capitalize">{selectedSection.replace('_', ' ')}</h3>
            <button
              onClick={() => { setSelectedSection(''); setEditContent(''); }}
              className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-96 font-mono text-sm border rounded p-3 bg-gray-50 dark:bg-gray-950 dark:border-gray-700"
            spellCheck={false}
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
            <p className="text-yellow-800 dark:text-yellow-300">
              <strong>Warning:</strong> Ensure the JSON is valid before saving. Invalid JSON will cause errors.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="border p-4 rounded flex justify-between items-center bg-white dark:bg-gray-900 dark:border-gray-800"
            >
              <div>
                <h3 className="font-semibold capitalize">{setting.section.replace('_', ' ')}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(setting.content.updated_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleEdit(setting)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900/20"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
