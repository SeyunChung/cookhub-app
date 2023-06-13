import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const RecipeForm = () => {
    
        //TODO: Add the correct default properties to the
        //initial state object
    
    const [recipe, update] = useState({
        recipeName: "",
        description: "",
        instruction: "",
        imageURL: "" // Add the imageURL property to the initial state
    })

    
        //TODO: Use the useNavigation() hook so you can redirect
        //the user to the recipe list
    
    const navigate = useNavigate()

    const localCookhubUser = localStorage.getItem("cookhub_user")
    const cookhubUserObject = JSON.parse(localCookhubUser)

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        // TODO: Create the object to be saved to the API

        const recipeToSendToAPI = {
            id: 0,
            recipeName: recipe.recipeName,
            imageURL: recipe.imageURL, // Include the imageURL in the object to be sent to the API
            description: recipe.description,
            instruction: recipe.instruction,
            userId: cookhubUserObject.id,
        }

        // TODO: Perform the fetch() to POST the object to the API
        return fetch(`http://localhost:8088/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipeToSendToAPI)
        })
            .then(response => response.json())
            .then(() => {
                navigate("/recipes")
            })
    }

    return (
        <form className="recipeForm">
            <h2 className="recipeForm__title">New recipe</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="recipename">Name:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Recipe Name"
                        value={recipe.recipeName}
                        onChange={
                            (evt) => {
                                const copy = { ...recipe }
                                copy.recipeName = evt.target.value
                                update(copy)
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="imageURL">Image URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter image URL"
                        value={recipe.imageURL}
                        onChange={(evt) => {
                            const copy = { ...recipe };
                            copy.imageURL = evt.target.value;
                            update(copy);
                        }}
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Brief description of recipe"
                        value={recipe.description}
                        onChange={
                            (evt) => {
                                const copy = { ...recipe }
                                copy.description = evt.target.value
                                update(copy)
                            }
                        } />
                </div>
            </fieldset>


            <fieldset>
                <div className="form-group">
                    <label htmlFor="instruction">Instruction:</label>
                    <input
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Enter Detail Recipe Instruction"
                        value={recipe.instruction}
                        onChange={
                            (evt) => {
                                const copy = { ...recipe }
                                copy.instruction = evt.target.value
                                update(copy)
                            }
                        } />
                </div>
            </fieldset>

            <button
                onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                className="btn btn-primary">
                Submit New Recipe
            </button>
        </form>
    )
}