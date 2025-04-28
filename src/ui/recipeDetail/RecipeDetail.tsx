import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Recipe } from "@/interfaces/recipesInterfaces";
import style from "./recipeDetail.module.scss";
import api from "@/axios/api";

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecipeDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getInfo(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    getRecipeDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading recipe details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!recipe) return <div className="not-found">Recipe not found</div>;

  return (
    <div className={style["recipe-detail"]}>
      <Link to="/" className="back-button">
        Back to Recipes
      </Link>

      <div className={style["recipe-header"]}>
        <h1>{recipe.strMeal}</h1>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="detail-image" />
      </div>

      <div className={style["recipe-meta"]}>
        <p>
          <strong>Category:</strong> {recipe.strCategory}
        </p>
        <p>
          <strong>Origin:</strong> {recipe.strArea}
        </p>
        {recipe.strTags && (
          <p>
            <strong>Tags:</strong> {recipe.strTags}
          </p>
        )}
      </div>

      <div className={style["recipe-ingredients"]}>
        <h2>Ingredients</h2>
        {(recipe.ingredients) ? 
        (<ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name}: {ingredient.measure}
            </li>
          ))}
        </ul>): null}

      </div>

      <div className={style["recipe-instructions"]}>
        <h2>Instructions</h2>
        <p>{recipe.strInstructions}</p>
      </div>

      {recipe.strYoutube && (
        <div className={style["recipe-video"]}>
          <h2>Video Tutorial</h2>
          <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
