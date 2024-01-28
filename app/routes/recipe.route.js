const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { authJwt } = require("../middleware");

router.post("/", recipeController.createRecipe);
router.get("/",authJwt.verifyToken ,recipeController.getAllRecipes);
router.get("/:recipeId", recipeController.getRecipeById);
router.put("/:recipeId", recipeController.updateRecipeById);
router.delete("/:recipeId", recipeController.deleteRecipeById);

module.exports = router;
