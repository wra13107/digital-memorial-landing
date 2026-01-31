import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  createLocalUser,
} from "../db";
import { hashPassword } from "../auth";
import { sendWelcomeEmail } from "../email";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
  listUsers: adminProcedure.query(async () => {
    return await getAllUsers();
  }),

  getUserDetails: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getUserById(input.id);
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["user", "admin"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.role) updateData.role = input.role;

      return await updateUser(input.id, updateData);
    }),

  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteUser(input.id);
    }),

  createUser: adminProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        phone: z.string().optional(),
        countryCode: z.string().optional(),
        role: z.enum(["user", "admin"]).optional().default("user"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const passwordHash = await hashPassword(input.password);
        const user = await createLocalUser({
          email: input.email,
          passwordHash,
          phone: input.phone || "+1",
          countryCode: input.countryCode || "US",
        });

        // Update role if admin
        if (input.role === "admin") {
          await updateUser(user.id, { role: "admin" });
        }

        // Send welcome email with credentials
        const loginUrl = 'https://digimemorial-7bqi4qlk.manus.space/login';
        await sendWelcomeEmail({
          email: input.email,
          firstName: "User",
          lastName: "",
          password: input.password,
          loginUrl,
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            countryCode: user.countryCode,
            role: input.role,
          },
        };
      } catch (error) {
        console.error("[Admin] Create user error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create user",
        });
      }
    }),
});
