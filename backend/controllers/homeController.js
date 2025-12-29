exports.getHome = (req, res) => {
  res.status(200).json({
    message: 'Welcome to the MonoDMS API',
    status: 'success',
  });
};
