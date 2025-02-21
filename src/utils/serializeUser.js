export const serializeUser = (user) => ({
  name: user.name,
  email: user.email,
  _id: user._id,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
