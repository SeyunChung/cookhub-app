import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8088/recipes/${recipeId}`)
      .then(response => response.json())
      .then(recipeData => {
        setRecipe(recipeData);
      })
      .catch(error => console.log(error));

    fetch("http://localhost:8088/recipeIngredients")
      .then(response => response.json())
      .then(data => {
        const recipeIngredients = data.find(item => item.recipeId === parseInt(recipeId));
        if (recipeIngredients) {
          fetch("http://localhost:8088/ingredients")
            .then(response => response.json())
            .then(ingredientData => {
              const recipeIngredientNames = recipeIngredients.ingredientId.map(
                ingredientId =>
                  ingredientData.find(
                    ingredient => ingredient.id === ingredientId
                  ).ingredientName
              );
              setIngredients(recipeIngredientNames);
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
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
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map(ingredient => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <h3>Instructions</h3>
          <div>{recipe.instruction}</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};
 
