import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8088/recipes/${recipeId}`)
      .then(response => response.json())
      .then(recipeData => {
        setRecipe(recipeData);
      });
  }, [recipeId]);

  const handleAllRecipesClick = () => {
    navigate("/recipes");
  };

  return (
    <>
      <button onClick={handleAllRecipesClick}>↩ 🧑‍🍳 Go Back To All Recipes 💘</button>
      {recipe ? (
        <>
          <h2>{recipe.recipeName}</h2>
          <div>{recipe.description}</div>
          <div>{recipe.instruction}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
