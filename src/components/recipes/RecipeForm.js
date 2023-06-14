import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const RecipeForm = () => {
    const [recipe, setRecipe] = useState({
        recipeName: "",
        description: "",
        instruction: "",
        imageURL: "",
        ingredient: [],
    });

    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8088/ingredients")
            .then((response) => response.json())
            .then((ingredientData) => {
                setIngredients(ingredientData);
                // Set initial value of ingredient in recipe state
                setRecipe((prevRecipe) => ({
                    ...prevRecipe,
                    ingredient: ingredientData.length > 0 ? ingredientData[0].id.toString() : ""
                }));
            })
            .catch((error) => {
                console.error("Error fetching ingredients:", error);
            });
    }, []);
    
    const handleInputChange = (e) => {
        const { name, value, options } = e.target;
    
        // Check if the input field is the ingredient dropdown
        if (name === 'ingredient') {
            const selectedIngredients = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
    
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                [name]: selectedIngredients,
            }));
        } else {
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                [name]: value,
            }));
        }
    };
    

    const handleSaveButtonClick = (event) => {
        event.preventDefault();
    
        const recipeToSendToAPI = {
            recipeName: recipe.recipeName,
            imageURL: recipe.imageURL,
            description: recipe.description,
            instruction: recipe.instruction,
            ingredientId: recipe.ingredient.map(id => parseInt(id))
        };
    
        fetch("http://localhost:8088/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeToSendToAPI),
        })
            .then((response) => response.json())
            .then((recipeData) => {
                const recipeId = recipeData.id;
    
                const recipeIngredientsToSendToAPI = {
                    recipeId: recipeId,
                    ingredientId: recipe.ingredient.map(id => parseInt(id))
                };
    
                fetch("http://localhost:8088/recipeIngredients", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(recipeIngredientsToSendToAPI),
                })
                    .then(() => {
                        navigate("/recipes");
                    })
                    .catch((error) => {
                        console.error("Error creating recipe ingredients:", error);
                    });
            })
            .catch((error) => {
                console.error("Error creating recipe:", error);
            });
    };
    

    return (
        <form className="recipeForm">
            <h2 className="recipeForm__title">New recipe</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipename">Name:</label>
                    <input
                        required
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Recipe Name"
                        name="recipeName"
                        value={recipe.recipeName}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="imageURL">Image URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter image URL"
                        name="imageURL"
                        value={recipe.imageURL}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input
                        required
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Brief description of recipe"
                        name="description"
                        value={recipe.description}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>

            <fieldset>
    <div className="form-group">
        <label>Ingredient:</label>
        <select
            name="ingredient"
            className="form-control"
            multiple
            value={recipe.ingredient}
            onChange={handleInputChange}
        >
            {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.ingredientName}
                </option>
            ))}
        </select>
    </div>
</fieldset>



            <fieldset>
                <div className="form-group">
                    <label htmlFor="instruction">Instruction:</label>
                    <input
                        required
                        autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Detail Recipe Instruction"
                        name="instruction"
                        value={recipe.instruction}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>

            <button onClick={handleSaveButtonClick} className="btn btn-primary">
                Submit New Recipe
            </button>
        </form>
    );
};









