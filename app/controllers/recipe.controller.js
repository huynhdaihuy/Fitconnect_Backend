const Recipe = require("../models/recipe.model");
const {
  cloudinaryUploadImg,
  cloudinaryUploadVideo,
} = require("../utils/cloudinary");
exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    let uploaderImage = (path) => cloudinaryUploadImg(path, "images");
    let uploaderVideo = (path) => cloudinaryUploadVideo(path, "video");
    const files = req.files;
    if (!files) {
      res.status(400).json({ error: "Can not receive file" });
      return;
    }
    const pathImage = files.image.tempFilePath;
    const pathVideo = files.video.tempFilePath;

    let newpathImage = await uploaderImage(pathImage);
    if (!newpathImage) {
      res.status(500).json({ error: "Failed to upload image" });
    }
    let newpathVideo = await uploaderVideo(pathVideo);
    if (!newpathVideo) {
      res.status(500).json({ error: "Failed to upload video" });
    }

    newRecipe.url_image = newpathImage.url;
    newRecipe.url_video = newpathVideo.url;
    const savedRecipe = await newRecipe.save();
    await savedRecipe.populate("author").execPopulate();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author").populate("ratings");
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error getting recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId)
      .populate("author")
      .populate("ratings");
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error getting recipe by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
    })
      .populate("author")
      .populate("ratings");
    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
      .populate("author")
      .populate("ratings");
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting recipe by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
