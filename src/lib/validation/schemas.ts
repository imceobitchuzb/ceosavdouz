import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  businessName: z.string().min(2, "Название компании должно содержать минимум 2 символа"),
  phone: z.string().min(9, "Введите корректный номер телефона (например, +998 90 123 45 67)"),
});

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email адрес"),
  password: z.string().min(1, "Введите пароль"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Название товара обязательно"),
  categoryId: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  costPrice: z.coerce.number().min(0, "Себестоимость не может быть отрицательной"),
  sellingPrice: z.coerce.number().min(0, "Цена продажи не может быть отрицательной"),
  stockQuantity: z.coerce.number().int("Количество должно быть целым числом").min(0, "Количество не может быть меньше 0"),
  minStockThreshold: z.coerce.number().int().min(0).default(5),
  unit: z.string().default("шт"),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Имя клиента обязательно"),
  phone: z.string().min(7, "Номер телефона обязателен"),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const orderItemSchema = z.object({
  productId: z.string().optional().nullable(),
  productName: z.string().min(1, "Наименование позиции обязательно"),
  quantity: z.coerce.number().int().min(1, "Количество минимум 1"),
  unitPrice: z.coerce.number().min(0, "Цена позиции не может быть отрицательной"),
  costPrice: z.coerce.number().min(0).default(0),
});

export const orderSchema = z.object({
  customerId: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Заказ должен содержать хотя бы один товар"),
  discountAmount: z.coerce.number().min(0).default(0),
  paidAmount: z.coerce.number().min(0).default(0),
  paymentStatus: z.enum(["UNPAID", "PARTIAL", "PAID"]).default("UNPAID"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER"]).default("CASH"),
  notes: z.string().optional().nullable(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]).default("COMPLETED"),
});

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Категория обязательна"),
  amount: z.coerce.number().positive("Сумма должна быть больше 0"),
  description: z.string().optional().nullable(),
  date: z.string().optional(),
});

export const customerPaymentSchema = z.object({
  amount: z.coerce.number().positive("Сумма платежа должна быть больше нуля"),
  paymentMethod: z.enum(["CASH", "CARD", "BANK_TRANSFER"]).default("CASH"),
  notes: z.string().optional().nullable(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Имя обязательно"),
  email: z.string().email("Введите корректный email"),
  role: z.enum(["ADMIN", "MANAGER", "CASHIER"]),
  password: z.string().min(6, "Временный пароль должен быть от 6 символов"),
  phone: z.string().optional().nullable(),
});

export const businessSettingsSchema = z.object({
  name: z.string().min(2, "Название бизнеса обязательно"),
  inn: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().default("Ташкент"),
});
