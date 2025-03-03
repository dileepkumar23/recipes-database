const {initializeDatabase} = require("./db/db.connect")

const Recipes = require("./models/recipes.models")

const express = require("express")

const app = express();

app.use(express.json())

const cors = require("cors")
app.use(cors());

initializeDatabase();

app.post("/recipes", async (req, res) => {
    try{
        const newRecipeData = req.body
        if(!newRecipeData.title || !newRecipeData.author || !newRecipeData.prepTime || !newRecipeData.cookTime || !newRecipeData.ingredients || 
            !newRecipeData.instructions || !newRecipeData.imageUrl
        ){
            res.status(400).json({error: "Ensure all the details are provided."})
        }
        else{
            const newRecipe = new Recipes(newRecipeData)
            await newRecipe.save();
            res.status(201).json({message: "Recipe added successfully"})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while creating recipe.", error})
    }
})


const PORT=9000
app.listen(PORT, () => {
    console.log("Successfully connected to port", PORT)
})

// read all recipes

async function readAllRecipes(){
    try{
        const recipes = await Recipes.find()
        return recipes
    }
    catch(error){console.log(error)}
}

app.get("/recipes", async (req, res) => {
    try{
        const recipes = await readAllRecipes()
        if(recipes.length != 0) {
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "Recipes not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while reading recipes."})
    }
})

// read recipe by title

async function readRecipeByTitle(recipeTitle){
    try{
    const recipes = await Recipes.findOne({title: recipeTitle})
    return recipes
    }
    catch(error){console.log(error)}
}

app.get("/recipes/:recipeTitle", async (req, res) => {
    try{
        const recipe = await readRecipeByTitle(req.params.recipeTitle)
        if (!recipe){
            
            res.status(404).json({error: "No recipe found."})
        }
        else{
            res.json(recipe)
            
        }

    }
    catch(error){
        res.status(500).json({error: "An error occured while reading recipe."})
    }
})

//recipe by author

async function readRecipeByAuthor(recipeAuthor){
    try{
        const recipes = await Recipes.find({author: recipeAuthor})
        return recipes
    }
    catch(error){console.log(error)}
}

app.get("/recipes/author/:recipeAuthor", async(req, res) => {
    try{
        const recipes = await readRecipeByAuthor(req.params.recipeAuthor)
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.json(404).json({error: "No recipe found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while reading recipes."})
    }
})


//read recipe by difficulty level.

async function readRecipeByDifficulty(recipeDifficulty){
    try{
        const recipes = await Recipes.find({difficulty: recipeDifficulty})
        return recipes
    }
    catch(error){console.log(error)}
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
    try{
        const recipes = await readRecipeByDifficulty(req.params.difficultyLevel)
        if(recipes.length != 0){
            res.json(recipes)
        }
        else{
            res.status(404).json({error: "No recipe found."})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while reading recipes."})
    }
})


// update difficulty level

async function updateRecipeDifficultyLevel(recipeId, dataToUpdate){
    try{
        const updatedRecipe = await Recipes.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
        return updatedRecipe
    }
    catch(error){console.log(error)}
}

app.post("/recipes/:recipeId", async (req, res) => {
    try{
        const recipe = await updateRecipeDifficultyLevel(req.params.recipeId , req.body)
        if (!recipe){
            res.status(404).json({error: "no recipe found."})
        }
        else{
            res.json(recipe)
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while updating recipes."})
    }
})

// update recipe prepTime and cookTime

async function updateRecipeByTitle(recipeTitle, dataToUpdate){
    try{
        const updatedRecipe = await Recipes.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
        return updatedRecipe
    }
    catch(error){console.log(error)}
}

app.post("/recipes/title/:recipeTitle", async (req, res) => {
    try{
        const recipe = await updateRecipeByTitle(req.params.recipeTitle, req.body)
        if(!recipe){
            res.status(404).json({error: "No recipe found."})
        }
        else{
            res.json(recipe)
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while updating data."})}
})

//delete recipe By Id

async function deleteReceipeById(recipeId){
    try{
        const updatedRecipe = await Recipes.findByIdAndDelete(recipeId)
        return updatedRecipe
    }
    catch(error){console.log(error)}
}

app.delete("/recipes/:recipeId", async (req, res) => {
    try{
        const recipe = await deleteReceipeById(req.params.recipeId)
        if(!recipe){
            res.status(404).json({error: "No recipe found."})
        }
        else{
            res.status(200).json({message: "Recipe deleted successfully", deletedRecipe: recipe})
        }
    }
    catch(error){
        res.status(500).json({error: "An error occured while updating recipes."})
    }
})