import {
  BaseResponse,
  Recipe,
  RecipeResponse,
  RecipesByFilter,
} from "@/interfaces/recipesInterfaces";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) console.error("Specify API_BASE_URL to correct backend request");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const api = {
  getAll: async (): Promise<Recipe[]> => {
    try {
      const response = await apiClient.get<BaseResponse<Recipe[]>>(`/getAll`);
      if (!response.data.success) {
        throw new Error("Failed to fetch recipes");
      }
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw new Error(JSON.stringify(error));
    }
  },

  getInfo: async (id: string): Promise<Recipe> => {
    try {
      const response = await apiClient.get<BaseResponse<RecipeResponse>>(`/getInfo?id=${id}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch recipe");
      }
      return response.data.data.meals[0];
    } catch (error) {
      console.error(error);
      throw new Error(JSON.stringify(error));
    }
  },

  getRecipesByFilter: async ({ type, filter_term }: RecipesByFilter): Promise<Recipe[]> => {
    try {
      const response = await apiClient.get<BaseResponse<Recipe[]>>(
        `/getFiltered?type=${type}&filter_term=${filter_term}`
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch recipe");
      }
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw new Error(JSON.stringify(error));
    }
  },
};

export default api;
