const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log("User is authenticated, proceeding to the next middleware/route handler.");
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    console.error("User is not authenticated. Redirecting to login page.");
    return res.redirect('/auth/login'); // Redirecting unauthenticated user to login page
  }
};

module.exports = {
  isAuthenticated
};