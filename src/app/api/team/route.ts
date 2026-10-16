import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { teamMemberSchema } from "@/lib/validation/schemas";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const members = await prisma.businessMember.findMany({
      where: { businessId: session.businessId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Ошибка загрузки сотрудников" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  // Authorization check: Only OWNER or ADMIN can add team members
  if (session.role !== "OWNER" && session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Недостаточно прав для управления сотрудниками" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validated = teamMemberSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Ошибка валидации данных сотрудника" },
        { status: 400 }
      );
    }

    const { name, email, role, password, phone } = validated.data;

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          phone: phone || null,
          passwordHash,
        },
      });
    }

    // Check if already a member of this business
    const existingMembership = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId: user.id,
          businessId: session.businessId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "Этот пользователь уже является сотрудником компании" },
        { status: 409 }
      );
    }

    const membership = await prisma.businessMember.create({
      data: {
        userId: user.id,
        businessId: session.businessId,
        role,
      },
      include: {
        user: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        action: "CREATE",
        entity: "TEAM",
        entityId: user.id,
        details: `Добавлен сотрудник: ${name} (${email}) с ролью ${role}`,
      },
    });

    return NextResponse.json({ success: true, member: membership }, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Ошибка при добавлении сотрудника" }, { status: 500 });
  }
}
