import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createSweet } from '../services/sweet.service';
import { deleteSweetById } from '../services/sweet.service';
import { getSweets } from '../services/sweet.service';
import { purchase } from '../services/sweet.service';
import { restock } from '../services/sweet.service';
import { getCategories } from '../services/sweet.service';
import { updateSweetById } from '../services/sweet.service';

// this adds a new sweet to the database
// it checks if the sweet already exists by name
export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;


    const newSweet = await createSweet({ name, category, price, quantity });
    res.status(201).json(newSweet);
  } catch (err: any) {
    if (err.message === 'Sweet already exists') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    const updatedSweet = await updateSweetById(id, { name, category, price, quantity });

    res.status(200).json(updatedSweet);
  } catch (err: any) {
    if (err && err.message === 'Sweet not found') {
      return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
// this deletes a sweet by its ID
export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Attempt to delete the sweet
    const deletedSweet = await deleteSweetById(id);

    // If not found, return 404
    if (!deletedSweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    // Success
    return res.status(200).json({
      message: 'Sweet deleted successfully',
      data: deletedSweet,
    });
  } catch (error) {
    console.error('❌ Error deleting sweet:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// this gets all sweets with optional filters, pagination, and sorting
// it allows filtering by name, category, price range, and sorting by a field in ascending or descending order
export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order = 'asc',
      page = '1',
      limit = '10',
    } = req.query;

    const filters = {
      name: name as string,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };

    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const sort = {
      sortBy: sortBy as string,
      order: order as string,
    };

    const { sweets, total } = await getSweets(filters, pagination, sort);

    res.status(200).json({
      sweets,
      total,
      page: pagination.page,
      totalPages: Math.ceil(total / pagination.limit),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
};

// this allows a user to purchase a sweet by its ID and quantity
// it checks if the sweet exists and if there is enough stock it updates the quantity
export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const updatedSweet = await purchase(id, quantity);

    res.status(200).json({
      message: 'Sweet purchased successfully',
      sweet: updatedSweet,
    });
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    if (error.message === 'Not enough stock') {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// this allows restocking a sweet by its ID and quantity
export const restockSweet = async (req: Request, res: Response) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: 'Quantity must be a positive number' });
  }

  try {
    const updatedSweet = await restock(sweetId, quantity);

    if (!updatedSweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.status(200).json(updatedSweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to restock sweet' });
  }
};

// this fetches all categories from the sweet schema
// it returns the enum values defined in the schema for the category field
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    if (!categories) {
      return res.status(404).json({ error: "Failed to fetch categories" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};