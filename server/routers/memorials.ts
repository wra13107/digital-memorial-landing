import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createMemorial,
  getMemorialsByUserId,
  getMemorialById,
  updateMemorial,
  addGalleryItem,
  getGalleryItemsByMemorialId,
  deleteGalleryItem,
} from "../db";

export const memorialsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        lastName: z.string().min(1),
        firstName: z.string().min(1),
        patronymic: z.string().optional(),
        birthDate: z.date().optional(),
        deathDate: z.date().optional(),
        burialPlace: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createMemorial({
        userId: ctx.user.id,
        lastName: input.lastName,
        firstName: input.firstName,
        patronymic: input.patronymic,
        birthDate: input.birthDate,
        deathDate: input.deathDate,
        burialPlace: input.burialPlace,
        latitude: input.latitude ? parseFloat(input.latitude).toString() : undefined,
        longitude: input.longitude ? parseFloat(input.longitude).toString() : undefined,
        description: input.description,
        isPublic: true,
      });
    }),

  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getMemorialsByUserId(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const memorial = await getMemorialById(input.id);
      if (!memorial) {
        throw new Error("Memorial not found");
      }
      if (memorial.userId !== ctx.user.id && !memorial.isPublic) {
        throw new Error("Access denied");
      }
      return memorial;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        lastName: z.string().optional(),
        firstName: z.string().optional(),
        patronymic: z.string().optional(),
        birthDate: z.date().optional(),
        deathDate: z.date().optional(),
        mainPhotoUrl: z.string().optional(),
        burialPlace: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        description: z.string().optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const memorial = await getMemorialById(input.id);
      if (!memorial || memorial.userId !== ctx.user.id) {
        throw new Error("Access denied");
      }

      const updateData: any = {};
      if (input.lastName) updateData.lastName = input.lastName;
      if (input.firstName) updateData.firstName = input.firstName;
      if (input.patronymic !== undefined) updateData.patronymic = input.patronymic;
      if (input.birthDate) updateData.birthDate = input.birthDate;
      if (input.deathDate) updateData.deathDate = input.deathDate;
      if (input.mainPhotoUrl) updateData.mainPhotoUrl = input.mainPhotoUrl;
      if (input.burialPlace) updateData.burialPlace = input.burialPlace;
      if (input.latitude) updateData.latitude = parseFloat(input.latitude).toString();
      if (input.longitude) updateData.longitude = parseFloat(input.longitude).toString();
      if (input.description) updateData.description = input.description;
      if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;

      return await updateMemorial(input.id, updateData);
    }),

  addGalleryItem: protectedProcedure
    .input(
      z.object({
        memorialId: z.number(),
        type: z.enum(["photo", "video", "audio"]),
        url: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const memorial = await getMemorialById(input.memorialId);
      if (!memorial || memorial.userId !== ctx.user.id) {
        throw new Error("Access denied");
      }

      return await addGalleryItem({
        memorialId: input.memorialId,
        type: input.type,
        url: input.url,
        title: input.title,
        description: input.description,
        displayOrder: 0,
      });
    }),

  getGalleryItems: protectedProcedure
    .input(z.object({ memorialId: z.number() }))
    .query(async ({ input }) => {
      return await getGalleryItemsByMemorialId(input.memorialId);
    }),

  deleteGalleryItem: protectedProcedure
    .input(z.object({ id: z.number(), memorialId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const memorial = await getMemorialById(input.memorialId);
      if (!memorial || memorial.userId !== ctx.user.id) {
        throw new Error("Access denied");
      }

      return await deleteGalleryItem(input.id);
    }),
});
