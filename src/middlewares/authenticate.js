/** @format */

export const isAuthenticated = (req, res, next) => {
  req.isAuthenticated = () => {
    return req.user ? true : false;
  };
  if (!req.isAuthenticated()) {
    throw new Error("Unauthorized. Please log in.");
  }
  next();
};
