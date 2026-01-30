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
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        role: z.enum(["user", "admin"]).optional().default("user"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const passwordHash = await hashPassword(input.password);
        const user = await createLocalUser({
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
        });

        // Update role if admin
        if (input.role === "admin") {
          await updateUser(user.id, { role: "admin" });
        }

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
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
