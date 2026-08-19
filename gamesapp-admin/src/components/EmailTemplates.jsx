export const WelcomeEmail = ({ name }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
    <div style="background: linear-gradient(135deg, #7c3aed, #3b82f6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0;">🎮 Welcome to GamesApp!</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <p style="color: #333; font-size: 16px;">Bonjour ${name || 'User'},</p>
      <p style="color: #555; font-size: 14px; line-height: 1.6;">
        Bienvenue sur GamesApp ! Nous sommes ravis de vous avoir parmi nous.
        Découvrez des histoires, vidéos et quiz éducatifs amusants pour tous les âges.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${window.location.origin}" 
           style="background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Commencer l'aventure
        </a>
      </div>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
        © 2024 GamesApp. Tous droits réservés.
      </p>
    </div>
  </div>
`;

export const PremiumApprovedEmail = ({ name, contentName }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
    <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0;">⭐ Premium Access Approved!</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <p style="color: #333; font-size: 16px;">Bonjour ${name || 'User'},</p>
      <p style="color: #555; font-size: 14px; line-height: 1.6;">
        Félicitations ! Votre accès premium pour <strong>${contentName}</strong> a été approuvé.
      </p>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          🎉 Vous pouvez maintenant accéder à tout le contenu premium sans restriction.
        </p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${window.location.origin}" 
           style="background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">
          Accéder maintenant
        </a>
      </div>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
        © 2024 GamesApp. Tous droits réservés.
      </p>
    </div>
  </div>
`;
