import { HttpStatusCode } from "axios";

export interface IngredientDto {
  name: string;
  measure: string;
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
  ingredients: IngredientDto[];
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
