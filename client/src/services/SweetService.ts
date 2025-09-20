import { useAuthStore } from '@/store/AuthStore';

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export type NewSweet = Omit<Sweet, "_id">;

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const state = useAuthStore.getState();
  console.log('Auth state:', { isAuthenticated: state.isAuthenticated, hasToken: !!state.token, hasUser: !!state.user });
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // Add Authorization header if user is authenticated
  if (state.isAuthenticated && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
    console.log('Adding Authorization header with token');
  } else {
    console.log('No token available for authorization');
  }
  
  return headers;
};

// API service
export const sweetService = {
  async getAllSweets(queryString: string = "") {
    const res = await fetch(`${API_URL}${queryString}`);
    

    if (!res.ok) {
      throw new Error("Failed to fetch sweets");
    }

    const data = await res.json();
    return data; // TypeScript will infer this as Sweet[]
  },
};

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();
  return data; // TypeScript will infer this as Sweet[]
};

export const addSweet = async (sweet: NewSweet): Promise<Sweet> => {
  console.log("Adding sweet:", sweet);
  
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(sweet),
  });

  if (!res.ok) {
    throw new Error("Failed to add sweet");
  }

  const data = await res.json();
  return data; // TypeScript will infer this as Sweet
};

export const updateSweetId = async (id: string, sweet: NewSweet): Promise<Sweet> => {
  console.log("Updating sweet:", sweet);
  
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(sweet),
  });

  if (!res.ok) {
    throw new Error("Failed to update sweet");
  }

  const data = await res.json();
  return data; // TypeScript will infer this as Sweet
};

export const deleteSweet = async (id: string): Promise<void> => {
  console.log('Attempting to delete sweet with ID:', id);
  const headers = getAuthHeaders();
  console.log('Request headers:', headers);
  
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers,
  });

  console.log('Delete response status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.log('Delete error response:', errorText);
    throw new Error("Failed to delete sweet");
  }
};

export const purchasetheSweet = async (id: string, quantity: number) => {
  const res = await fetch(`${API_URL}/${id}/purchase`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to purchase sweet");
  }

  return res.json();
};

export const restocktheSweet = async (id: string, quantity: number) => {
  const res = await fetch(`${API_URL}/${id}/restock`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    throw new Error("Failed to restock sweet");
  }

  return await res.json();
};
