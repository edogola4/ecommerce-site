import { Request, Response } from 'express';
import categoryService from '../services/category.service';

export const getAllCategories = async (_: Request, res: Response) => {
  const categories = await categoryService.getAll();
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);
  res.status(201).json(category);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Not found' });
  res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await categoryService.update(req.params.id, req.body);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await categoryService.delete(req.params.id);
  res.status(204).send();
};
