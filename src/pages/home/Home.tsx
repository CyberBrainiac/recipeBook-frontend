import { useEffect, useState } from "react";
import style from "./home.module.scss";
import { FiltersType, Recipe } from "@/interfaces/recipesInterfaces";
import { Link, useLocation } from "react-router-dom";
import api from "@/axios/api";

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Recipes");
  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // Parse query parameters
        const searchParams = new URLSearchParams(location.search);
        const type = searchParams.get("type") as FiltersType;
        const filter_term = searchParams.get("filter_term");

        let data: Recipe[];

        if (type && filter_term) {
          data = await api.getRecipesByFilter({ type, filter_term });
          if (type === "i") {
            setTitle(`Recipes By Ingredient: ${filter_term}`);
          } else if (type === "a") {
            setTitle(`Recipes By Country: ${filter_term}`);
          } else if (type === "c") {
            setTitle(`Recipes By Category: ${filter_term}`);
          }
        } else {
          data = await api.getAll();
          setTitle("Recipes");
        }

        setRecipes(data);
        setError(null);
      } catch (err) {
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.search]);

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={style["recipe-list"]}>
      <h1>{title}</h1>
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
              {recipe.strCategory ? <p>Category: {recipe.strCategory}</p> : null}
              {recipe.strArea ? <p>Origin: {recipe.strArea}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
