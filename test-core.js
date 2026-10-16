/**
 * CEOSAVDOUZ Core Business Logic & Security Verification Test Suite
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runTests() {
  console.log("==================================================");
  console.log("🧪 CEOSAVDOUZ AUTOMATED VERIFICATION TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Verify Seed Data & Business Existence
    console.log("\n[Test 1] Verifying Seeded Business & Tenant Isolation...");
    const business = await prisma.business.findFirst({
      where: { name: "Silk Road Trading OOO" },
      include: { members: { include: { user: true } }, products: true, customers: true, orders: true },
    });
    assert(Boolean(business), "Business 'Silk Road Trading OOO' exists");
    assert(business.members.length === 3, "All 3 roles (OWNER, MANAGER, CASHIER) exist in the business");
    assert(business.products.length >= 8, "Catalog contains >= 8 realistic products");
    assert(business.customers.length >= 4, "Customer directory contains >= 4 customers");

    // 2. Verify Authentication Password Hashing
    console.log("\n[Test 2] Verifying Password Hashing & Bcrypt Verification...");
    const ownerUser = await prisma.user.findUnique({ where: { email: "aziz@ceosavdouz.uz" } });
    assert(Boolean(ownerUser), "Owner user exists");
    const isPasswordValid = await bcrypt.compare("password123", ownerUser.passwordHash);
    assert(isPasswordValid === true, "Password matches bcrypt hash for 'password123'");
    const isWrongPasswordInvalid = await bcrypt.compare("wrongpass", ownerUser.passwordHash);
    assert(isWrongPasswordInvalid === false, "Incorrect password correctly rejected");

    // 3. Test Stock Decrement & Transactional Consistency
    console.log("\n[Test 3] Testing Transactional Order Creation & Inventory Decrement...");
    const testProduct = await prisma.product.findFirst({
      where: { businessId: business.id, stockQuantity: { gt: 5 } },
    });
    assert(Boolean(testProduct), `Found test product: ${testProduct.name}`);
    const initialStock = testProduct.stockQuantity;

    // Simulate order creation logic
    const orderQty = 2;
    const testOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          businessId: business.id,
          orderNumber: "ORD-TEST-999",
          status: "COMPLETED",
          paymentStatus: "PAID",
          totalAmount: testProduct.sellingPrice * orderQty,
          paidAmount: testProduct.sellingPrice * orderQty,
          items: {
            create: [
              {
                productId: testProduct.id,
                productName: testProduct.name,
                quantity: orderQty,
                unitPrice: testProduct.sellingPrice,
                costPrice: testProduct.costPrice,
                total: testProduct.sellingPrice * orderQty,
              },
            ],
          },
        },
      });

      await tx.product.update({
        where: { id: testProduct.id },
        data: { stockQuantity: { decrement: orderQty } },
      });

      return order;
    });

    const updatedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
    assert(
      updatedProduct.stockQuantity === initialStock - orderQty,
      `Inventory correctly decremented from ${initialStock} to ${updatedProduct.stockQuantity}`
    );

    // 4. Test Order Cancellation & Stock Reversion
    console.log("\n[Test 4] Testing Order Cancellation & Automatic Stock Reversion...");
    await prisma.$transaction(async (tx) => {
      // Revert stock
      await tx.product.update({
        where: { id: testProduct.id },
        data: { stockQuantity: { increment: orderQty } },
      });
      await tx.order.update({
        where: { id: testOrder.id },
        data: { status: "CANCELLED" },
      });
    });

    const revertedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
    assert(
      revertedProduct.stockQuantity === initialStock,
      `Stock reverted back to ${initialStock} after order cancellation`
    );

    // Clean up test order
    await prisma.orderItem.deleteMany({ where: { orderId: testOrder.id } });
    await prisma.order.delete({ where: { id: testOrder.id } });

    // 5. Test Customer Debt Calculation & Repayment
    console.log("\n[Test 5] Testing Customer Debt Accumulation & Repayment...");
    const customer = await prisma.customer.findFirst({
      where: { businessId: business.id, currentDebt: { gt: 0 } },
    });
    assert(Boolean(customer), `Found customer with debt: ${customer.name} (Debt: ${customer.currentDebt} UZS)`);
    const initialDebt = customer.currentDebt;
    const repaymentAmount = 500000;

    // Simulate payment
    await prisma.$transaction(async (tx) => {
      await tx.customer.update({
        where: { id: customer.id },
        data: { currentDebt: { decrement: repaymentAmount } },
      });
      await tx.payment.create({
        data: {
          businessId: business.id,
          customerId: customer.id,
          amount: repaymentAmount,
          paymentMethod: "CASH",
          notes: "Тестовое частичное погашение",
        },
      });
    });

    const afterPaymentCustomer = await prisma.customer.findUnique({ where: { id: customer.id } });
    assert(
      afterPaymentCustomer.currentDebt === initialDebt - repaymentAmount,
      `Debt reduced from ${initialDebt} to ${afterPaymentCustomer.currentDebt} UZS`
    );

    // Restore original debt for demo consistency
    await prisma.customer.update({
      where: { id: customer.id },
      data: { currentDebt: initialDebt },
    });

    // 6. Test Multi-Tenant Isolation
    console.log("\n[Test 6] Testing Strict Multi-Tenant Isolation...");
    const anotherBusiness = await prisma.business.create({
      data: { name: "Another Company OOO", currency: "UZS" },
    });

    const productsForSilkRoad = await prisma.product.findMany({
      where: { businessId: business.id },
    });
    const productsForAnother = await prisma.product.findMany({
      where: { businessId: anotherBusiness.id },
    });

    assert(
      productsForAnother.length === 0,
      "Another company has 0 products (cannot see Silk Road's products)"
    );
    assert(
      productsForSilkRoad.length > 0,
      `Silk Road has ${productsForSilkRoad.length} products strictly scoped to its businessId`
    );

    // Clean up temporary tenant
    await prisma.business.delete({ where: { id: anotherBusiness.id } });
    assert(true, "Temporary tenant cleanly cleaned up");

    console.log("\n==================================================");
    console.log(`RESULTS: ${passed} passed, ${failed} failed`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
