import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { memorialsRouter } from "./routers/memorials";
import { adminRouter } from "./routers/admin";
import { z } from "zod";
import { hashPassword, verifyPassword, createToken, createAuthCookie } from "./auth";
import { getUserByEmail, createLocalUser, getUserById, updateUser } from "./db";
import { TRPCError } from "@trpc/server";

const COOKIE_NAME = "auth_token";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    // Local authentication: Register
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email("Invalid email address"),
          password: z.string().min(8, "Password must be at least 8 characters"),
          firstName: z.string().min(1, "First name is required"),
          lastName: z.string().min(1, "Last name is required"),
          patronymic: z.string().optional(),
          birthDate: z.date().optional(),
          deathDate: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Check if user already exists
          const existingUser = await getUserByEmail(input.email);
          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User with this email already exists",
            });
          }

          // Hash password
          const passwordHash = await hashPassword(input.password);

          // Create user
          const result = await createLocalUser({
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            patronymic: input.patronymic,
            birthDate: input.birthDate,
            deathDate: input.deathDate,
          });

          // Get the created user
          const user = await getUserByEmail(input.email);
          if (!user) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create user",
            });
          }

          // Create JWT token with admin flag for 10-minute timeout
          const isAdmin = user.role === 'admin';
          const token = await createToken(user.id, user.email!, isAdmin);

          // Set cookie
          ctx.res.setHeader("Set-Cookie", createAuthCookie(token));

          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error("[Auth] Registration error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Registration failed",
          });
        }
      }),

    // Local authentication: Login
    login: publicProcedure
      .input(
        z.object({
          email: z.string(),
          password: z.string().min(1, "Password is required"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Try to find user by email first, then by username
          let user = await getUserByEmail(input.email);
          
          if (!user) {
            // Try to find by username if email lookup fails
            const { getUserByUsername } = await import("./db");
            user = await getUserByUsername(input.email);
          }
          if (!user || !user.passwordHash) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid email/username or password",
            });
          }

          // Verify password
          const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
          if (!isPasswordValid) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid email/username or password",
            });
          }

          // Create JWT token with admin flag for 10-minute timeout
          const isAdmin = user.role === 'admin';
          const token = await createToken(user.id, user.email!, isAdmin);

          // Set cookie
          ctx.res.setHeader("Set-Cookie", createAuthCookie(token));

          return {
            success: true,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          console.error("[Auth] Login error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Login failed",
          });
        }
      }),

    // Get user profile
    profile: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const user = await getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic,
        birthDate: user.birthDate,
        deathDate: user.deathDate,
        role: user.role,
      };
    }),

    // Update user profile
    updateProfile: protectedProcedure
      .input(
        z.object({
          firstName: z.string().min(1, "First name is required").optional(),
          lastName: z.string().min(1, "Last name is required").optional(),
          patronymic: z.string().optional(),
          birthDate: z.date().optional(),
          deathDate: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        try {
          const updateData: any = {};
          if (input.firstName !== undefined) updateData.firstName = input.firstName;
          if (input.lastName !== undefined) updateData.lastName = input.lastName;
          if (input.patronymic !== undefined) updateData.patronymic = input.patronymic;
          if (input.birthDate !== undefined) updateData.birthDate = input.birthDate;
          if (input.deathDate !== undefined) updateData.deathDate = input.deathDate;
          
          // Update name field for display
          if (input.firstName || input.lastName) {
            const user = await getUserById(ctx.user.id);
            const firstName = input.firstName || user?.firstName || "";
            const lastName = input.lastName || user?.lastName || "";
            updateData.name = `${firstName} ${lastName}`.trim();
          }

          await updateUser(ctx.user.id, updateData);

          const updatedUser = await getUserById(ctx.user.id);
          return {
            success: true,
            user: {
              id: updatedUser?.id,
              email: updatedUser?.email,
              firstName: updatedUser?.firstName,
              lastName: updatedUser?.lastName,
              patronymic: updatedUser?.patronymic,
              birthDate: updatedUser?.birthDate,
              deathDate: updatedUser?.deathDate,
              role: updatedUser?.role,
            },
          };
        } catch (error) {
          console.error("[Auth] Profile update error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update profile",
          });
        }
      }),
  }),
  memorials: memorialsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
