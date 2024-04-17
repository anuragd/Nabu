const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const generateSvgOverlay = (username, date) => {
  // Ensure SVG is properly formatted for Sharp processing
  return `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="black">${username} - ${date}</text>
  </svg>`;
};

const generateBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('Error finding user for badge generation:', new Error('User does not exist.'));
      throw new Error('User does not exist.');
    }
    if (user.currentLevel < 20) {
      console.error('Error generating badge: User has not completed all levels.');
      throw new Error('User has not completed all levels.');
    }
    // Assuming a badge template image exists at the specified path
    const badgeTemplatePath = path.join(__dirname, '../public/images/badgeTemplate.png');
    const outputPath = path.join(__dirname, `../public/badges/${user.username}_badge.png`);
    const completionDate = new Date().toLocaleDateString("en-US");

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    const svgOverlay = generateSvgOverlay(user.username, completionDate);
    const svgBuffer = Buffer.from(svgOverlay);
    await sharp(badgeTemplatePath)
      .composite([
        { 
          input: svgBuffer, 
          gravity: 'south',
          blend: 'over'
        }
      ])
      .toFile(outputPath);

    // Update user record with badge path and mark badge as generated
    user.badgePath = outputPath.replace(__dirname, ''); // Save relative path
    await user.markBadgeAsGenerated(); // Mark the badge as generated

    console.log('Badge generated successfully for user:', user.username);
  } catch (error) {
    console.error('Error in badge generation process:', error.message, error.stack);
    throw error; // Rethrow the error after logging to handle it further up the call stack if necessary.
  }
};

module.exports = { generateBadge };