import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecipeEdit = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8088/recipes/${recipeId}`)
      .then((response) => response.json())
      .then((recipeData) => {
        setRecipeData(recipeData);
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
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8088/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        console.log("Recipe updated:", updatedData);
        navigate("/recipes");
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
      });
  };

  if (!recipeData || !ingredients) {
    return <div>Loading...</div>;
  }

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
        <label>
          Ingredients:
          <select
            name="ingredient"
            value={recipeData.ingredient}
            onChange={handleInputChange}
          >
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.ingredientName}
              </option>
            ))}
          </select>
        </label>
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

