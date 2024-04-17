const dotenv = require('dotenv');
dotenv.config();

// Function to generate share URLs for social media platforms
const generateShareUrls = (badgePath) => {
  const shareText = encodeURIComponent("I've just completed the Nabu Web Puzzle and unlocked a digital badge! Check it out!");
  const badgeUrl = encodeURIComponent(`${process.env.APP_BASE_URL}${badgePath}`);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${badgeUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${badgeUrl}`,
    instagram: `https://www.instagram.com/?url=${badgeUrl}` // Note: Instagram does not officially support direct sharing via URL. This is just for demonstration.
  };
};

module.exports = { generateShareUrls };