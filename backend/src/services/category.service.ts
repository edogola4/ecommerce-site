import prisma from '../utils/prisma';

const getAll = () => prisma.category.findMany();

const getById = (id: string) => prisma.category.findUnique({ where: { id } });

const create = (data: {
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
}) => prisma.category.create({ data });

const update = (id: string, data: Partial<{ name: string; description: string; image: string; parentId: string }>) =>
  prisma.category.update({ where: { id }, data });

const deleteCategory = (id: string) =>
  prisma.category.delete({ where: { id } });

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteCategory,
};
