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

  const localCookhubUser = localStorage.getItem("cookhub_user")
  const cookhubUserObject = JSON.parse(localCookhubUser)

  useEffect(() => {
    fetch("http://localhost:8088/ingredients")
      .then((response) => response.json())
      .then((ingredientData) => {
        setIngredients(ingredientData);
        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          ingredient: [],
        }));
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedIngredients = checked
        ? [...recipe.ingredient, value]
        : recipe.ingredient.filter((ingredient) => ingredient !== value);

      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: updatedIngredients,
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
      id: 0,
      userId: cookhubUserObject.id,
      recipeName: recipe.recipeName,
      imageURL: recipe.imageURL,
      description: recipe.description,
      instruction: recipe.instruction,
      ingredientId: recipe.ingredient.map((id) => parseInt(id)),
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
          ingredientId: recipe.ingredient.map((id) => parseInt(id)),
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
          {ingredients.map((ingredient) => (
            <div key={ingredient.id}>
              <label>
                <input
                  type="checkbox"
                  name="ingredient"
                  value={ingredient.id}
                  checked={recipe.ingredient.includes(ingredient.id.toString())}
                  onChange={handleInputChange}
                />
                {ingredient.ingredientName}
              </label>
            </div>
          ))}
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