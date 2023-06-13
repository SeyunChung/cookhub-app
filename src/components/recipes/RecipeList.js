import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./List.css";

export const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8088/recipes")
      .then((response) => response.json())
      .then((recipeArray) => {
        setRecipes(recipeArray);
      });
  }, []);

  const deleteRecipe = (recipeId) => {
    fetch(`http://localhost:8088/recipes/${recipeId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Recipe deleted successfully
          // Refresh the list of recipes
          fetch("http://localhost:8088/recipes")
            .then((response) => response.json())
            .then((recipeArray) => {
              setRecipes(recipeArray);
            });
        }
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
      });
  };

  return (
    <>
      <button onClick={() => navigate("/recipe/create")}>Add New Recipe</button>
      <h2>List of Recipes</h2>
      <article className="recipes">
        {recipes.map((recipe) => (
          <section className="recipe" key={`recipe--${recipe.id}`}>
            <Link to={`/recipes/${recipe.id}`}>
              <header>{recipe.recipeName}</header>
            </Link>
            <div>{recipe.description}</div>
            <img
              src={recipe.imageURL}
              alt="Recipe"
              width="300px"
              height="200px"
            />

            <div>
              <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>
              <button onClick={() => navigate(`/recipe/edit/${recipe.id}`)}>Edit</button>
            </div>
          </section>
        ))}
      </article>
    </>
  );
};

