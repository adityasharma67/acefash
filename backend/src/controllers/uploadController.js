const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Image file is required');
    }

    res.status(200).json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };
