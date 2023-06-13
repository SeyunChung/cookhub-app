import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecipeEdit = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8088/recipes/${recipeId}`)
            .then((response) => response.json())
            .then((recipeData) => {
                setRecipeData(recipeData);
            })
            .catch((error) => {
                console.error("Error fetching recipe data:", error);
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

        // Make a PUT request to update the recipe data
        fetch(`http://localhost:8088/recipes/${recipeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipeData),
        })
            .then((response) => response.json())
            .then((updatedData) => {
                // Handle the updated recipe data
                console.log("Recipe updated:", updatedData);
                navigate("/recipes");
            })
            .catch((error) => {
                console.error("Error updating recipe:", error);
            });
    };

    if (!recipeData) {
        return <div>Loading...</div>;
    }

    // Render the edit form with the current recipe data
    return (
        <div>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                {/* Render the form fields with the current recipe data */}
                <label>
                    Recipe Name:
                    <input
                        type="text"
                        name="recipeName"
                        value={recipeData.recipeName}
                        onChange={handleInputChange}
                    />
                    <pre>{recipeData.recipeName}</pre>
                </label>
                <label>
                    Food Image:
                    <input
                        type="text"
                        name="imageURL"
                        value={recipeData.imageURL}
                        onChange={handleInputChange}
                    />
                    <pre>{recipeData.imageURL}</pre>
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={recipeData.description}
                        onChange={handleInputChange}
                    />
                    <pre>{recipeData.description}</pre>
                </label>
                <label>
                    Instruction:
                    <textarea
                        name="instruction"
                        value={recipeData.instruction}
                        onChange={handleInputChange}
                    />
                    <pre>{recipeData.instruction}</pre>
                </label>
                {/* Render other form fields with the current recipe data */}
                {/* ... */}
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};
