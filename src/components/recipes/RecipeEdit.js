import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecipeEdit = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({ ingredients: [] });
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8088/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((recipeData) => {
        setRecipeData(recipeData);
        setSelectedIngredients(recipeData.ingredientId || []);
      })
      .catch((error) => {
        console.error("Error fetching recipe data:", error);
      });

    fetch("http://localhost:8088/ingredients")
      .then((response) => response.json())
      .then((ingredientData) => {
        setIngredients(ingredientData);
      })
      .catch((error) => {
        console.error("Error fetching ingredients:", error);
      });
  }, [recipeId]);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith("ingredient-")) {
      const ingredientId = name.split("-")[1];
      if (checked) {
        setSelectedIngredients((prevIngredients) => [
          ...prevIngredients,
          parseInt(ingredientId),
        ]);
      } else {
        setSelectedIngredients((prevIngredients) =>
          prevIngredients.filter(
            (ingredient) => ingredient !== parseInt(ingredientId)
          )
        );
      }
      setRecipeData((prevData) => ({
        ...prevData,
        ingredientId: selectedIngredients,
      }));
    } else {
      setRecipeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecipeData = {
      ...recipeData,
      ingredientId: selectedIngredients,
    };

    fetch(`http://localhost:8088/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        console.log("Recipe updated:", updatedData);

        const recipeIngredientData = {
          recipeId: parseInt(recipeId),
          ingredientId: selectedIngredients,
        };

        fetch(`http://localhost:8088/recipeIngredients/${updatedData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipeIngredientData),
        })
          .then((response) => response.json())
          .then((updatedRecipeIngredientData) => {
            console.log(
              "Recipe ingredients updated:",
              updatedRecipeIngredientData
            );
            navigate("/recipes");
          })
          .catch((error) => {
            console.error("Error updating recipe ingredients:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
      });
  };

  return (
    <div>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Recipe Name:
          <input
            type="text"
            name="recipeName"
            value={recipeData.recipeName}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={recipeData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="imageURL"
            value={recipeData.imageURL}
            onChange={handleInputChange}
          />
        </label>

        {ingredients.map((ingredient) => (
          <label key={ingredient.id}>
            <input
              type="checkbox"
              name={`ingredient-${ingredient.id}`}
              value={ingredient.id}
              onChange={handleInputChange}
              checked={selectedIngredients.includes(ingredient.id)}
            />
            {ingredient.ingredientName}
          </label>
        ))}

        <label>
          Instructions:
          <textarea
            name="instruction"
            value={recipeData.instruction}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};