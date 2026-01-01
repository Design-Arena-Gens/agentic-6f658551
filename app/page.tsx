'use client';

import { useState } from 'react';

interface Email {
  id: number;
  from: string;
  subject: string;
  body: string;
  timestamp: string;
  reply?: string;
  status: 'pending' | 'replied' | 'failed';
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [replyTemplate, setReplyTemplate] = useState('professional');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddTestEmail = () => {
    const testEmails = [
      {
        from: 'client@example.com',
        subject: 'Project Update Request',
        body: 'Hi, I would like to know the status of the current project. Can you provide an update?',
      },
      {
        from: 'partner@company.com',
        subject: 'Meeting Schedule',
        body: 'Could we schedule a meeting next week to discuss the proposal?',
      },
      {
        from: 'support@service.com',
        subject: 'Question About Service',
        body: 'I have a question about your pricing plans. Can you help me understand the differences?',
      },
    ];

    const randomEmail = testEmails[Math.floor(Math.random() * testEmails.length)];
    const newEmail: Email = {
      id: Date.now(),
      ...randomEmail,
      timestamp: new Date().toLocaleString(),
      status: 'pending',
    };

    setEmails((prev) => [newEmail, ...prev]);

    if (autoReplyEnabled) {
      generateReply(newEmail.id, newEmail.body, newEmail.subject);
    }
  };

  const generateReply = async (emailId: number, emailBody: string, emailSubject: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailBody,
          emailSubject,
          template: replyTemplate,
          customInstructions,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        setEmails((prev) =>
          prev.map((email) =>
            email.id === emailId
              ? { ...email, reply: data.reply, status: 'replied' as const }
              : email
          )
        );
      } else {
        setEmails((prev) =>
          prev.map((email) =>
            email.id === emailId ? { ...email, status: 'failed' as const } : email
          )
        );
      }
    } catch (error) {
      console.error('Error generating reply:', error);
      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, status: 'failed' as const } : email
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualReply = (emailId: number, emailBody: string, emailSubject: string) => {
    generateReply(emailId, emailBody, emailSubject);
  };

  const clearEmails = () => {
    setEmails([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Email Auto Reply System
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Automated email responses powered by AI
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Auto Reply</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Automatically reply to new emails
                  </p>
                </div>
                <button
                  onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    autoReplyEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      autoReplyEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block font-semibold text-gray-800 dark:text-white mb-2">
                  Reply Template
                </label>
                <select
                  value={replyTemplate}
                  onChange={(e) => setReplyTemplate(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="brief">Brief</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="block font-semibold text-gray-800 dark:text-white mb-2">
                Custom Instructions
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add any specific instructions for replies..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddTestEmail}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Add Test Email
            </button>
            <button
              onClick={clearEmails}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Email Inbox ({emails.length})
          </h2>

          {emails.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No emails yet. Click "Add Test Email" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                          {email.subject}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            email.status === 'replied'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : email.status === 'failed'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                        >
                          {email.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        From: {email.from}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{email.timestamp}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      {email.body}
                    </p>
                  </div>

                  {email.reply && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        Auto Reply:
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg whitespace-pre-wrap">
                        {email.reply}
                      </p>
                    </div>
                  )}

                  {email.status === 'pending' && (
                    <button
                      onClick={() => handleManualReply(email.id, email.body, email.subject)}
                      disabled={isGenerating}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Reply'}
                    </button>
                  )}

                  {email.status === 'failed' && (
                    <button
                      onClick={() => handleManualReply(email.id, email.body, email.subject)}
                      disabled={isGenerating}
                      className="mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
