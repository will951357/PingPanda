// lib/api.ts
import axios from "axios";
import { type Categories , CategoryInfo} from "@/types/types";
import { type Event } from "@/types/types";
import { type EventsByCategoryName, UserQuota } from "@/types/types";
import superjson from "superjson"

export const syncClerkUser = async (token: string) => {
  if (!token) throw new Error("No Clerk token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/sync`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const getSingleUser = async (token: string) => {
  if (!token) throw new Error("No Clerk token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const getCategories = async (token: string): Promise<Categories[]> => {
  if (!token) throw new Error ("No token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.json.categories;

}


export const getAllCategories = async (): Promise<Categories[]> => {

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/category/all`);

  console.log('getAllCategories', res.data.json.categories)
  return res.data.json.categories;

}

export const deleteCategory = async (token: string, name: string) => {
  if (!token) throw new Error ("No token provided");
  
  const res = await axios.delete(`${import.meta.env.VITE_API_URL}/category/${name}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log('Deletar categoria')

  return res.data
}

export const createCategory = async (token: string, name: string, color: string | undefined, emoji: string | undefined) => {
  if (!token) throw new Error ("No token provided");

  const res = await axios.post(`${import.meta.env.VITE_API_URL}/category`, {
    name,
    color,
    emoji
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data
}


export const quickStartCategories = async (token: string) => {
  if (!token) throw new Error ("No token provided");

  const res = await axios.post(`${import.meta.env.VITE_API_URL}/category/start`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data
}

export const categoryInfo = async (token: string, name: string): Promise<CategoryInfo | null> => {
  if (!token) throw new Error ("No token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/category/info/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data
}

export const getEventsByCategoryName = async (token: string, name: string, timeRange: "today" | "week" | "month", page: number, limit: number): Promise<EventsByCategoryName> => {

  //console.log(`${import.meta.env.VITE_API_URL}/events?categoryName=${name}&page=${page}&limit=${limit}&timeRange=${timeRange}`, "token \n", token)

  if (!token) throw new Error ("No token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/events?categoryName=${name}&page=${page}&limit=${limit}&timeRange=${timeRange}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //console.log('getEventsByCategoryName', res.data.json)

  return superjson.deserialize(res.data)
}

export const getStripeRoute = async (token: string) => {

    console.log("stripe")
    if (!token) throw new Error ("No token provided");

    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-checkout-session`, 
        {},
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );
      
      const { url } = response.data;

      if (url) {
        window.location.href = url
      } else {
        console.error('URL de checkout não recebida');
      }
    } catch (err) {
      console.error('Erro ao criar sessão de checkout:', err);
    }
    
}

export const getQuota = async (token: string): Promise<UserQuota> => {

  //console.log(`${import.meta.env.VITE_API_URL}/events?categoryName=${name}&page=${page}&limit=${limit}&timeRange=${timeRange}`, "token \n", token)

  if (!token) throw new Error ("No token provided");

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/quota`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  return superjson.deserialize(res.data)
}


export const updateDiscordId = async (token: string, discordId: string): Promise<UserQuota> => {

  if (!token) throw new Error ("No token provided");

  const res = await axios.put(
    `${import.meta.env.VITE_API_URL}/user/discord`,
    { discordId }, // corpo (body) da requisição
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data
}
