import { Route, Routes} from "react-router-dom";
import { RecipeDetail } from "../recipes/RecipeDetail";
import { RecipeForm } from "../recipes/RecipeForm";
import { RecipeList } from "../recipes/RecipeList";
import { RecipeEdit } from "../recipes/RecipeEdit"; 





export const ApplicationViews = () => (
  <Routes>
    <Route path="/recipes" element={<RecipeList />} />
    <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
    <Route path="recipe/create" element={ <RecipeForm /> } />
    
    <Route path="/recipe/edit/:recipeId" element={<RecipeEdit />} />

  </Routes>
);



