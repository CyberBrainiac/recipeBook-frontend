import { useEffect, useState } from "react";
import style from "./home.module.scss";
import { Recipe } from "@/interfaces/recipesInterfaces";
import { Link } from "react-router-dom";
import api from "@/axios/api";

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecipes = async () => {
      try {
        setLoading(true);
        const data = await api.getAll();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    getRecipes();
  }, []);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={style["recipe-list"]}>
      <h1>Recipes</h1>
      <div className={style["recipe-grid"]}>
        {recipes.map(recipe => (
          <Link
            to={`/recipe/${recipe.idMeal}`}
            className={style["recipe-card"]}
            key={recipe.idMeal}
          >
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className={style["recipe-image"]} />
            <div className={style["recipe-info"]}>
              <h2>{recipe.strMeal}</h2>
              <p>Category: {recipe.strCategory}</p>
              <p>Origin: {recipe.strArea}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
