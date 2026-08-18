import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { useToast } from '../contexts/ToastContext';

export function Comments({ itemId, itemType }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: comments, addItem, deleteItem } = useFirestore('comments');
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  const itemComments = comments.filter(c => c.itemId === itemId && c.type === itemType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('⚠️ Please write a comment', 'warning');
      return;
    }

    try {
      await addItem({
        itemId,
        type: itemType,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        comment: newComment,
        rating: rating,
        createdAt: new Date().toISOString()
      });
      showToast('✅ Comment added!', 'success');
      setNewComment('');
      setRating(0);
    } catch (error) {
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        💬 Comments ({itemComments.length})
      </h4>

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-all duration-300 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">Post</button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {itemComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{comment.userName}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < comment.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
              {comment.userId === user?.uid && (
                <button
                  onClick={() => deleteItem(comment.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
            <p className="text-gray-700 mt-2">{comment.comment}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
