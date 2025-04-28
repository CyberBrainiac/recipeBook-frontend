import { HttpStatusCode } from "axios";

export interface Ingredient {
  name: string;
  measure: string;
}

export type FiltersType = "i" | "a" | "c";

export interface RecipesByFilter {
  type: FiltersType;
  filter_term: string;
}

export interface RecipeDetailProps {
  category: Set<string>;
}

export interface CategoryContextProps {
  categorySet: Set<string> | undefined;
}

// Context Provider Component
export interface CategoryProviderProps extends CategoryContextProps {
  children: React.ReactNode;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealAlternate?: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  ingredients: Ingredient[];
  strSource?: string | null;
  strImageSource?: string | null;
  strCreativeCommonsConfirmed?: string | null;
  dateModified?: string | null;
}

export interface RecipeResponse {
  meals: Recipe[];
}

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  statusCode: HttpStatusCode;
}
