import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Recipe } from "@/interfaces/recipesInterfaces";
import api from "@/axios/api";
import styles from "./recipeDetail.module.scss";

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipesByCategory, setRecipesByCategory] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecipeDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await api.getInfo(id);
        setRecipe(data);
        setError(null);

        // Fetch recipes from the same category
        if (data.strCategory) {
          const recipes = await api.getRecipesByFilter({
            type: "c",
            filter_term: data.strCategory,
          });
          setCategory(data.strCategory);
          setRecipesByCategory(recipes);
        }
      } catch (err) {
        setError("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    getRecipeDetails();
  }, [id]);

  const handleCountryClick = (country: string) => {
    navigate(`/?type=a&filter_term=${country}`);
  };

  const handleIngredientClick = (ingredient: string) => {
    navigate(`/?type=i&filter_term=${ingredient}`);
  };

  if (loading) return <div className={styles.loading}>Loading recipe details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!recipe) return <div className={styles.notFound}>Recipe not found</div>;

  return (
    <div className={styles.recipeDetail}>
      <div className={styles.recipeContainer}>
        <div className={styles.recipeMain}>
          <Link to="/" className={styles.backButton}>
            Back to All Recipes
          </Link>

          <div className={styles.recipeContent}>
            <div className={styles.recipeImageContainer}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} className={styles.recipeImage} />
            </div>

            <div className={styles.recipeInfo}>
              <h1 className={styles.recipeTitle}>{recipe.strMeal}</h1>

              <div className={styles.recipeOrigin}>
                <span
                  onClick={() => handleCountryClick(recipe.strArea)}
                  className={styles.countryLink}
                >
                  {recipe.strArea}
                </span>
              </div>

              <div className={styles.recipeInstructions}>
                <h2>Instructions</h2>
                <p>{recipe.strInstructions}</p>
              </div>

              <div className={styles.recipeIngredients}>
                <h2>Ingredients</h2>
                {recipe.ingredients ? (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <span
                          onClick={() => handleIngredientClick(ingredient.name)}
                          className={styles.ingredientLink}
                        >
                          {ingredient.name}
                        </span>
                        : {ingredient.measure}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {recipe.strYoutube && (
                <div className={styles.recipeVideo}>
                  <h2>Video Tutorial</h2>
                  <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.recipeSidebar}>
          <h2>{recipe.strCategory} Recipes</h2>
          {recipesByCategory.length > 0 ? (
            <div className={styles.categoryList}>
              {recipesByCategory.map(recipeByCategory => (
                <Link
                  key={recipeByCategory.idMeal}
                  to={`/?type=c&filter_term=${category}`}
                  className={styles.categoryItem}
                >
                  {recipeByCategory.strMeal}
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.loadingCategory}>Loading related recipes...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
