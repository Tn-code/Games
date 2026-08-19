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
  const [loading, setLoading] = useState(false);

  // Filter comments for this specific item
  const itemComments = comments.filter(c => c.itemId === itemId && c.type === itemType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('⚠️ Veuillez écrire un commentaire', 'warning');
      return;
    }

    if (!user) {
      showToast('⚠️ Veuillez vous connecter pour commenter', 'warning');
      return;
    }

    setLoading(true);

    try {
      await addItem({
        itemId: itemId,
        type: itemType,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0] || 'User',
        comment: newComment.trim(),
        rating: rating || 0,
        createdAt: new Date().toISOString()
      });
      showToast('✅ Commentaire ajouté avec succès!', 'success');
      setNewComment('');
      setRating(0);
    } catch (error) {
      showToast(`❌ Erreur: ${error.message}`, 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Voulez-vous supprimer ce commentaire?')) return;
    try {
      await deleteItem(commentId);
      showToast('✅ Commentaire supprimé', 'success');
    } catch (error) {
      showToast(`❌ Erreur: ${error.message}`, 'error');
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          💬 Commentaires ({itemComments.length})
        </h4>
        {itemComments.length > 0 && (
          <span className="text-sm text-gray-500">
            • {itemComments.filter(c => c.rating > 0).length} évaluations
          </span>
        )}
      </div>

      {/* Add Comment */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-600">Évaluation :</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-all duration-300 hover:scale-110 ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-yellow-600 ml-2">
                {rating} {rating === 1 ? 'étoile' : 'étoiles'}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez un commentaire..."
              className="input-field flex-1"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary whitespace-nowrap flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Envoi...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Publier
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 mb-6">
          <i className="fas fa-lock mr-2"></i>
          Connectez-vous pour commenter
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {itemComments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-comment text-4xl mb-2 block"></i>
            <p>Aucun commentaire pour le moment</p>
            <p className="text-sm">Soyez le premier à commenter!</p>
          </div>
        ) : (
          itemComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {comment.userName?.[0] || 'U'}
                    </div>
                    <p className="font-medium text-gray-800">{comment.userName || 'Utilisateur'}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {comment.rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < comment.rating ? '★' : '☆'}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        ({comment.rating})
                      </span>
                    </div>
                  )}
                </div>
                {(comment.userId === user?.uid || user?.isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-600 transition-all text-sm"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <p className="text-gray-700 mt-2">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
