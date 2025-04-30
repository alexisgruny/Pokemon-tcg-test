import { Model, ModelStatic, Op, WhereOptions } from 'sequelize';

export async function searchByColumn<T extends Model>(
  model: ModelStatic<T>,
  column: keyof T['_attributes'],
  searchTerm: string
): Promise<T[]> {
  const whereClause: WhereOptions = {
    [column as string]: {
      [Op.iLike]: `%${searchTerm}%`,
    },
  };

  return await model.findAll({ where: whereClause });
}