import { createUserSchema } from './create-user.schema';

// Tạo updateUserSchema từ createUserSchema, set tất cả trường thành optional
export const updateUserSchema = createUserSchema.fork(
  Object.keys(createUserSchema.describe().keys), // lấy tất cả key trong create schema
  (schema) => schema.optional(),
);
