const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CEOSAVDOUZ database seeding...");

  // Clear existing records safely
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.businessMember.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 1. Create Business
  const business = await prisma.business.create({
    data: {
      name: "Silk Road Trading OOO",
      inn: "308945123",
      phone: "+998 71 234-56-78",
      address: "г. Ташкент, Чиланзарский р-н, ул. Катартал, 28",
      city: "Ташкент",
      currency: "UZS",
    },
  });

  console.log(`✓ Business created: ${business.name} (ID: ${business.id})`);

  // 2. Create Users & Memberships
  const ownerUser = await prisma.user.create({
    data: {
      email: "aziz@ceosavdouz.uz",
      name: "Азиз Каримов",
      passwordHash,
      phone: "+998901234567",
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: "nigora@ceosavdouz.uz",
      name: "Нигора Рахимова",
      passwordHash,
      phone: "+998912345678",
    },
  });

  const cashierUser = await prisma.user.create({
    data: {
      email: "jasur@ceosavdouz.uz",
      name: "Жасур Алиев",
      passwordHash,
      phone: "+998933456789",
    },
  });

  await prisma.businessMember.createMany({
    data: [
      { userId: ownerUser.id, businessId: business.id, role: "OWNER" },
      { userId: managerUser.id, businessId: business.id, role: "MANAGER" },
      { userId: cashierUser.id, businessId: business.id, role: "CASHIER" },
    ],
  });

  console.log("✓ Users & roles created (aziz@ceosavdouz.uz / password123)");

  // 3. Create Categories
  const catElectronics = await prisma.category.create({
    data: { businessId: business.id, name: "Электроника и гаджеты", description: "Смартфоны, кабели, аудио" },
  });
  const catTextile = await prisma.category.create({
    data: { businessId: business.id, name: "Одежда и текстиль", description: "Узбекский текстиль и одежда" },
  });
  const catHome = await prisma.category.create({
    data: { businessId: business.id, name: "Товары для дома", description: "Постельное белье, декор" },
  });
  const catGrocery = await prisma.category.create({
    data: { businessId: business.id, name: "Продукты и бакалея", description: "Чай, сухофрукты, крупы" },
  });

  // 4. Create Products
  const p1 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catElectronics.id,
      name: "Смартфон Artel U5 128GB Black",
      sku: "ART-U5-128",
      barcode: "478001234501",
      costPrice: 1450000,
      sellingPrice: 1950000,
      stockQuantity: 14,
      minStockThreshold: 4,
      unit: "шт",
    },
  });

  const p2 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catElectronics.id,
      name: "Беспроводные наушники EarBuds Pro",
      sku: "EBP-2026-W",
      barcode: "478001234502",
      costPrice: 180000,
      sellingPrice: 320000,
      stockQuantity: 28,
      minStockThreshold: 5,
      unit: "шт",
    },
  });

  const p3 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catElectronics.id,
      name: "Кабель Type-C 1.5m FastCharge 65W",
      sku: "CBL-TC-65",
      barcode: "478001234503",
      costPrice: 25000,
      sellingPrice: 65000,
      stockQuantity: 85,
      minStockThreshold: 10,
      unit: "шт",
    },
  });

  const p4 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catTextile.id,
      name: "Мужская рубашка хлопок (Samarkand Classic)",
      sku: "SMR-SH-CL",
      barcode: "478001234504",
      costPrice: 110000,
      sellingPrice: 220000,
      stockQuantity: 34,
      minStockThreshold: 8,
      unit: "шт",
    },
  });

  const p5 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catTextile.id,
      name: "Джинсы Regular Fit Tashkent Denim",
      sku: "TSH-DN-RG",
      barcode: "478001234505",
      costPrice: 160000,
      sellingPrice: 310000,
      stockQuantity: 22,
      minStockThreshold: 5,
      unit: "шт",
    },
  });

  const p6 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catHome.id,
      name: "Набор сатинового белья 'Bukhara Gold' Евро",
      sku: "BKH-SAT-EV",
      barcode: "478001234506",
      costPrice: 280000,
      sellingPrice: 490000,
      stockQuantity: 3, // LOW STOCK
      minStockThreshold: 6,
      unit: "компл",
    },
  });

  const p7 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catGrocery.id,
      name: "Чай черный байховый 250г 'Ташкентский'",
      sku: "TEA-TSH-250",
      barcode: "478001234507",
      costPrice: 18000,
      sellingPrice: 32000,
      stockQuantity: 115,
      minStockThreshold: 20,
      unit: "пачка",
    },
  });

  const p8 = await prisma.product.create({
    data: {
      businessId: business.id,
      categoryId: catGrocery.id,
      name: "Рис Аланга премиум 5кг (Хорезм)",
      sku: "RIC-ALN-5",
      barcode: "478001234508",
      costPrice: 75000,
      sellingPrice: 115000,
      stockQuantity: 2, // LOW STOCK
      minStockThreshold: 5,
      unit: "мешок",
    },
  });

  console.log("✓ Catalog products created (with realistic margins and units)");

  // 5. Create Customers
  const c1 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Шерзод Умаров",
      phone: "+998909876543",
      address: "г. Ташкент, Юнусабад-11, д. 45",
      notes: "Постоянный розничный клиент, предпочитает доставку курьером Yandex",
      totalSpent: 4230000,
      currentDebt: 0,
    },
  });

  const c2 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "ООО 'Оазис Дистрибьюшн'",
      phone: "+998712001122",
      address: "г. Ташкент, Мирабадский р-н, ул. Нукус, 12",
      notes: "Оптовый партнер. Отсрочка платежа до 14 календарных дней",
      totalSpent: 18450000,
      currentDebt: 4500000, // Client debt
    },
  });

  const c3 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Дильноза Юсупова",
      phone: "+998935432109",
      address: "г. Самарканд, ул. Дагбитская, 89",
      notes: "Instagram магазин / оптовые закупки текстиля",
      totalSpent: 8760000,
      currentDebt: 0,
    },
  });

  const c4 = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Фарход Мирзаев",
      phone: "+998977123456",
      address: "г. Фергана, ул. Б. Маргилани, 3",
      notes: "Региональный магазин электроники",
      totalSpent: 6320000,
      currentDebt: 1200000, // Client debt
    },
  });

  console.log("✓ Customers with realistic debt profiles created");

  // 6. Create Orders & Order Items
  // Order 1: Completed
  const order1 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: c1.id,
      orderNumber: "ORD-1001",
      status: "COMPLETED",
      paymentStatus: "PAID",
      totalAmount: 2270000,
      discountAmount: 0,
      paidAmount: 2270000,
      notes: "Оплата Uzcard в точке самовывоза",
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      items: {
        create: [
          { productId: p1.id, productName: p1.name, quantity: 1, unitPrice: 1950000, costPrice: 1450000, total: 1950000 },
          { productId: p2.id, productName: p2.name, quantity: 1, unitPrice: 320000, costPrice: 180000, total: 320000 },
        ],
      },
    },
  });

  // Order 2: Completed wholesale with partial debt
  const order2 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: c2.id,
      orderNumber: "ORD-1002",
      status: "COMPLETED",
      paymentStatus: "PARTIAL",
      totalAmount: 9500000,
      discountAmount: 500000,
      paidAmount: 4500000,
      notes: "Договор поставки №48, остаток 4 500 000 сум по графику",
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      items: {
        create: [
          { productId: p4.id, productName: p4.name, quantity: 20, unitPrice: 220000, costPrice: 110000, total: 4400000 },
          { productId: p5.id, productName: p5.name, quantity: 15, unitPrice: 310000, costPrice: 160000, total: 4650000 },
          { productId: p3.id, productName: p3.name, quantity: 15, unitPrice: 65000, costPrice: 25000, total: 950000 },
        ],
      },
    },
  });

  // Order 3: Processing
  const order3 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: c3.id,
      orderNumber: "ORD-1003",
      status: "PROCESSING",
      paymentStatus: "PAID",
      totalAmount: 1470000,
      discountAmount: 0,
      paidAmount: 1470000,
      notes: "Отправка в Самарканд через BTS Post",
      createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      items: {
        create: [
          { productId: p6.id, productName: p6.name, quantity: 3, unitPrice: 490000, costPrice: 280000, total: 1470000 },
        ],
      },
    },
  });

  // Order 4: Pending / New
  const order4 = await prisma.order.create({
    data: {
      businessId: business.id,
      customerId: c4.id,
      orderNumber: "ORD-1004",
      status: "PENDING",
      paymentStatus: "UNPAID",
      totalAmount: 3900000,
      discountAmount: 0,
      paidAmount: 0,
      notes: "Заказ через Telegram бота. Требуется подтверждение наличия",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      items: {
        create: [
          { productId: p1.id, productName: p1.name, quantity: 2, unitPrice: 1950000, costPrice: 1450000, total: 3900000 },
        ],
      },
    },
  });

  console.log("✓ Orders & order items created");

  // 7. Create Financial Transactions (Strict separation of manual income/expenses & order totals)
  await prisma.transaction.createMany({
    data: [
      {
        businessId: business.id,
        type: "EXPENSE",
        category: "Аренда",
        amount: 5500000,
        description: "Аренда коммерческого помещения и склада за текущий месяц",
        date: new Date(Date.now() - 10 * 24 * 3600 * 1000),
      },
      {
        businessId: business.id,
        type: "EXPENSE",
        category: "Зарплата",
        amount: 8000000,
        description: "Аванс сотрудникам отдела продаж и склада",
        date: new Date(Date.now() - 8 * 24 * 3600 * 1000),
      },
      {
        businessId: business.id,
        type: "EXPENSE",
        category: "Логистика",
        amount: 680000,
        description: "Транспортные расходы и городская курьерская доставка",
        date: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      },
      {
        businessId: business.id,
        type: "EXPENSE",
        category: "Маркетинг",
        amount: 1500000,
        description: "Таргетированная реклама в Instagram и Telegram",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        businessId: business.id,
        type: "INCOME",
        category: "Оплата заказа",
        amount: 2270000,
        description: "Оплата заказа ORD-1001 от Шерзод Умаров",
        date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        relatedOrderId: order1.id,
      },
      {
        businessId: business.id,
        type: "INCOME",
        category: "Оплата заказа",
        amount: 4500000,
        description: "Первый транш по заказу ORD-1002 от ООО 'Оазис Дистрибьюшн'",
        date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        relatedOrderId: order2.id,
      },
    ],
  });

  console.log("✓ Financial transactions registered");

  // 8. Notifications
  await prisma.notification.createMany({
    data: [
      {
        businessId: business.id,
        title: "Критический остаток товара",
        message: "Остаток товара «Набор сатинового белья Bukhara Gold» составляет 3 шт. Пополните склад.",
        type: "STOCK",
        isRead: false,
      },
      {
        businessId: business.id,
        title: "Критический остаток товара",
        message: "Остаток товара «Рис Аланга премиум 5кг (Хорезм)» составляет 2 шт.",
        type: "STOCK",
        isRead: false,
      },
      {
        businessId: business.id,
        title: "Новый заказ ORD-1004",
        message: "Поступил новый заказ на сумму 3 900 000 сум от Фарход Мирзаев.",
        type: "ORDER",
        isRead: false,
      },
      {
        businessId: business.id,
        title: "Успешная частичная оплата",
        message: "Получен платеж 4 500 000 сум по заказу ORD-1002.",
        type: "FINANCE",
        isRead: true,
      },
    ],
  });

  console.log("✓ Notifications seeded");
  console.log("🚀 Database seeded successfully with authentic Uzbekistan business data!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
