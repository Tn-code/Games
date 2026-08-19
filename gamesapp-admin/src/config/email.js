// Email configuration
export const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: 'Houssinetrabelsi6@gmail.com',
    pass: '03691355_Houssine'
  },
  from: 'GamesApp <noreply@gamesapp.com>'
};

export const EMAIL_TEMPLATES = {
  welcome: {
    subject: '🎮 Welcome to GamesApp!',
    template: 'welcome'
  },
  premiumApproved: {
    subject: '⭐ Your Premium Access Has Been Approved!',
    template: 'premium_approved'
  },
  premiumRejected: {
    subject: '📋 Premium Request Update',
    template: 'premium_rejected'
  },
  newContent: {
    subject: '📚 New Content Available!',
    template: 'new_content'
  },
  commentReply: {
    subject: '💬 Someone Replied to Your Comment!',
    template: 'comment_reply'
  }
};
