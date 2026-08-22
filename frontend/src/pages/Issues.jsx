import { useState, useEffect } from 'react';
import { issuesAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['reported', 'acknowledged', 'pending', 'resolved'];

const statusColor = {
  reported: '#e67e22',
  acknowledged: '#3498db',
  pending: '#9b59b6',
  resolved: '#27ae60'
};

function IssueCard({ issue, onStatusChange, canManage }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const latestStatusChange = issue.statusHistory?.[issue.statusHistory.length - 1];
  const statusChangedAt = latestStatusChange?.changedAt || issue.updatedAt || issue.createdAt;

  const loadComments = async () => {
    try {
      setLoadingComments(true);
      const data = await commentsAPI.getByIssue(issue._id);
      setComments(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) loadComments();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentsAPI.create(issue._id, { text: commentText });
      setCommentText('');
      loadComments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <h3>{issue.title}</h3>
        <span className="status-badge" style={{ background: statusColor[issue.status] }}>
          {issue.status}
        </span>
      </div>
      <p>{issue.description}</p>
      <p className="issue-meta">Reported by {issue.reportedBy?.name || 'Unknown'}</p>
      {statusChangedAt && (
        <p className="issue-meta">
          {issue.status === 'resolved' ? 'Resolved' : 'Status updated'} at{' '}
          {new Date(statusChangedAt).toLocaleString()}
        </p>
      )}

      {canManage && (
        <div className="status-controls">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`status-btn ${issue.status === s ? 'active' : ''}`}
              onClick={() => onStatusChange(issue._id, s)}
              disabled={issue.status === s}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <button className="toggle-comments-btn" onClick={toggleComments}>
        {showComments ? 'Hide comments' : 'View comments'}
      </button>

      {showComments && (
        <div className="comments-section">
          {loadingComments && <p>Loading comments...</p>}
          {comments.map(c => (
            <div key={c._id} className="comment">
              <strong>{c.author?.name}</strong>
              {c.isFromSpecialist && <span className="specialist-tag"> (Specialist)</span>}
              <p>{c.text}</p>
            </div>
          ))}
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment or update..."
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusAnnouncement, setStatusAnnouncement] = useState('');
  const { isAuthenticated, user } = useAuth();

  const canManage = user && (user.role === 'admin' || user.role === 'elder');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issuesAPI.getAll();
      setIssues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await issuesAPI.create({ title, description });
      setTitle('');
      setDescription('');
      fetchIssues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const updatedIssue = await issuesAPI.updateStatus(issueId, newStatus);
      const previousIssue = issues.find(issue => issue._id === issueId);
      const changedAt = updatedIssue.statusHistory?.[updatedIssue.statusHistory.length - 1]?.changedAt;
      const time = changedAt ? new Date(changedAt).toLocaleString() : new Date().toLocaleString();
      setStatusAnnouncement(
        `${updatedIssue.title} moved from ${previousIssue?.status || 'reported'} to ${newStatus} at ${time}.`
      );
      fetchIssues();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="issues-page">
      <h2>Community Issues</h2>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="issue-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Reporting...' : 'Report Issue'}
          </button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}
      {statusAnnouncement && (
        <p className="status-announcement" role="status" aria-live="polite">
          {statusAnnouncement}
        </p>
      )}
      {loading && <p>Loading issues...</p>}

      <div className="issue-list">
        {issues.map(issue => (
          <IssueCard
            key={issue._id}
            issue={issue}
            onStatusChange={handleStatusChange}
            canManage={canManage}
          />
        ))}
      </div>
    </div>
  );
}

export default Issues;
