import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
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
        burialPlace: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        description: z.string().optional(),
        epitaph: z.string().optional(),
        mainPhotoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await createMemorial({
        userId: ctx.user.id,
        lastName: input.lastName,
        firstName: input.firstName,
        patronymic: input.patronymic,
        burialPlace: input.burialPlace,
        latitude: input.latitude ? parseFloat(input.latitude).toString() : null,
        longitude: input.longitude ? parseFloat(input.longitude).toString() : null,
        description: input.description,
        epitaph: input.epitaph,
        mainPhotoUrl: input.mainPhotoUrl,
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
        mainPhotoUrl: z.string().optional(),
        burialPlace: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        description: z.string().optional(),
        epitaph: z.string().optional(),
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
      if (input.mainPhotoUrl) updateData.mainPhotoUrl = input.mainPhotoUrl;
      if (input.burialPlace) updateData.burialPlace = input.burialPlace;
      if (input.latitude) updateData.latitude = parseFloat(input.latitude).toString();
      if (input.longitude) updateData.longitude = parseFloat(input.longitude).toString();
      if (input.description) updateData.description = input.description;
      if (input.epitaph !== undefined) updateData.epitaph = input.epitaph;
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

  // Generate presigned URL for file upload
  uploadMedia: protectedProcedure
    .input(
      z.object({
        memorialId: z.number(),
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        fileSize: z.number().min(1),
        mediaType: z.enum(["photo", "video", "audio"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate file size (100MB max)
      const MAX_FILE_SIZE = 100 * 1024 * 1024;
      if (input.fileSize > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 100MB limit");
      }

      // Validate file types
      const allowedTypes: Record<string, string[]> = {
        photo: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        video: ["video/mp4", "video/webm", "video/quicktime"],
        audio: ["audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"],
      };

      if (!allowedTypes[input.mediaType].includes(input.fileType)) {
        throw new Error(`Invalid file type for ${input.mediaType}`);
      }

      // Check memorial ownership
      const memorial = await getMemorialById(input.memorialId);
      if (!memorial || memorial.userId !== ctx.user.id) {
        throw new Error("Access denied");
      }

      // Generate S3 key
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const s3Key = `memorials/${ctx.user.id}/${input.memorialId}/${input.mediaType}/${timestamp}-${randomSuffix}-${input.fileName}`;

      // Return S3 key for client-side upload
      return {
        s3Key,
        mediaType: input.mediaType,
        fileName: input.fileName,
      };
    }),

  // Confirm media upload and add to gallery
  confirmMediaUpload: protectedProcedure
    .input(
      z.object({
        memorialId: z.number(),
        s3Key: z.string(),
        mediaType: z.enum(["photo", "video", "audio"]),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check memorial ownership
      const memorial = await getMemorialById(input.memorialId);
      if (!memorial || memorial.userId !== ctx.user.id) {
        throw new Error("Access denied");
      }

      // Construct S3 URL
      const s3Url = `https://${process.env.VITE_FRONTEND_FORGE_API_URL?.split("//")[1] || "s3.amazonaws.com"}/${input.s3Key}`;

      // Add to gallery
      return await addGalleryItem({
        memorialId: input.memorialId,
        type: input.mediaType,
        url: s3Url,
        title: input.title,
        description: input.description,
        displayOrder: 0,
      });
    }),

  // Public procedure to get memorial details without authentication
  getPublic: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const memorial = await getMemorialById(input.id);
      if (!memorial || !memorial.isPublic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memorial not found or is not public",
        });
      }
      return memorial;
    }),

  // Public procedure to get gallery items for a memorial
  getPublicGallery: publicProcedure
    .input(z.object({ memorialId: z.number() }))
    .query(async ({ input }) => {
      const memorial = await getMemorialById(input.memorialId);
      if (!memorial || !memorial.isPublic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memorial not found or is not public",
        });
      }
      return await getGalleryItemsByMemorialId(input.memorialId);
    }),
});
