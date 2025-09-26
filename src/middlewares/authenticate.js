/** @format */

export const isAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => {
    return req.user && req.user._id;
  };
  if (!req.isAuthenticated()) {
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};
