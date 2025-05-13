import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode
  } from "react";
  import { deleteCategory, getCategories, createCategory, quickStartCategories } from "@/lib/api";
  import type { baseCategory, Categories } from "@/types/types";
  import { useAuth } from "@clerk/clerk-react";
  import { type EventCategoryForm } from "@/types/types";
  
  type CategoryContextType = {
    categories: Categories[];
    loading: boolean;
    deletingCategory: string | null;
    setDeletingCategory: (name: string | null) => void;
    isDeletingCategory: boolean;
    deleteCategoryByName: (name: string) => Promise<void>;
    creatingCategory: boolean;
    createNewCategory: (category: EventCategoryForm) => Promise<void>;
    addCategory: (category: Categories) => void;
    quickStart: () => Promise<void>;
  };
  
  interface CategoryProviderProps {
    children: ReactNode;
  }
  
  const CategoryContext = createContext<CategoryContextType | undefined>(
    undefined
  );
  
  export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (!context) {
      throw new Error("useCategoryContext must be used within a CategoryProvider");
    }
    return context;
  };
  
  export const CategoryProvider = ({ children }: CategoryProviderProps) => {
    const [categories, setCategories] = useState<Categories[]>([]);
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);
    const [creatingCategory, setCreatingCategory] = useState(false);

    const fetchCategories = async () => {
      const token = await getToken();
      try {
        const res = await getCategories(token!);
        setCategories(res);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

    const deleteCategoryByName = async (name: string) => {
      const token = await getToken();
      try {
        setIsDeletingCategory(true);
        await deleteCategory(token!, name);
        setDeletingCategory(null); // Clear the selected state
        await fetchCategories(); // 🔁 Reload the list after deletion
      } catch (error) {
        console.error("Error deleting category", error);
      } finally {
        setIsDeletingCategory(false);
      }
    }

    const createNewCategory = async (category: EventCategoryForm) => {
      const token = await getToken();
      try {
        setCreatingCategory(true);
        await createCategory(token!, category.name, category.color, category.emoji);
        setCreatingCategory(false);
        await fetchCategories(); // 🔁 Reload the list 
      } catch (error) {
        console.error("Error creating category", error);
      } finally {
        setCreatingCategory(false);
      }
    }

    const quickStart = async () => {
      const token = await getToken();
      try {
        setCreatingCategory(true);
        await quickStartCategories(token!);
        await fetchCategories(); // 🔁 Reload the list 
      } catch (error) {
        console.error("Error creating category", error);
      } finally {
        setCreatingCategory(false);
      }
    }
  
    const addCategory = (category: Categories) => {
      setCategories((prev) => [...prev, category]);
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    return (
      <CategoryContext.Provider value={{ categories,
          loading,
          deletingCategory,
          setDeletingCategory,
          isDeletingCategory,
          deleteCategoryByName,
          creatingCategory,
          createNewCategory, 
          addCategory,
          quickStart}}>
          {children}
        </CategoryContext.Provider>
      );
  };
  