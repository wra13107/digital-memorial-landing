import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createLocalUser, getUserById, createMemorial, addGalleryItem, getGalleryItemsByMemorialId, deleteGalleryItem } from "./db";
import { hashPassword } from "./auth";

describe("Media Operations", () => {
  let testUserId: number;
  let testMemorialId: number;

  beforeAll(async () => {
    // Create a test user
    const passwordHash = await hashPassword("TestPassword123!");
    const user = await createLocalUser({
      email: `media-test-${Date.now()}@test.com`,
      passwordHash,
      firstName: "Test",
      lastName: "User",
      patronymic: "Testovich",
      birthDate: new Date("1990-01-01"),
      deathDate: new Date("2020-01-01"),
    });
    
    testUserId = user.id;

    // Create a test memorial
    const memorial = await createMemorial({
      userId: testUserId,
      lastName: "Test",
      firstName: "User",
      patronymic: "Testovich",
      birthDate: new Date("1990-01-01"),
      deathDate: new Date("2020-01-01"),
      isPublic: true,
    });

    testMemorialId = memorial[0].insertId;
  });

  afterAll(async () => {
    // Cleanup is handled by database
  });

  it("should add a photo to gallery", async () => {
    const result = await addGalleryItem({
      memorialId: testMemorialId,
      type: "photo",
      url: "https://example.com/photo.jpg",
      title: "Test Photo",
      description: "A test photo",
      displayOrder: 0,
    });

    expect(result).toBeDefined();
  });

  it("should add a video to gallery", async () => {
    const result = await addGalleryItem({
      memorialId: testMemorialId,
      type: "video",
      url: "https://example.com/video.mp4",
      title: "Test Video",
      description: "A test video",
      displayOrder: 1,
    });

    expect(result).toBeDefined();
  });

  it("should add an audio file to gallery", async () => {
    const result = await addGalleryItem({
      memorialId: testMemorialId,
      type: "audio",
      url: "https://example.com/audio.mp3",
      title: "Test Audio",
      description: "A test audio file",
      displayOrder: 2,
    });

    expect(result).toBeDefined();
  });

  it("should retrieve all gallery items for a memorial", async () => {
    const items = await getGalleryItemsByMemorialId(testMemorialId);

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("should retrieve gallery items by type", async () => {
    const items = await getGalleryItemsByMemorialId(testMemorialId);
    const photoItems = items.filter((item) => item.type === "photo");
    const videoItems = items.filter((item) => item.type === "video");
    const audioItems = items.filter((item) => item.type === "audio");

    expect(photoItems.length).toBeGreaterThan(0);
    expect(videoItems.length).toBeGreaterThan(0);
    expect(audioItems.length).toBeGreaterThan(0);
  });

  it("should delete a gallery item", async () => {
    const items = await getGalleryItemsByMemorialId(testMemorialId);
    const itemToDelete = items[0];

    await deleteGalleryItem(itemToDelete.id);

    const updatedItems = await getGalleryItemsByMemorialId(testMemorialId);
    expect(updatedItems.length).toBe(items.length - 1);
  });

  it("should handle gallery items with optional fields", async () => {
    const result = await addGalleryItem({
      memorialId: testMemorialId,
      type: "photo",
      url: "https://example.com/photo2.jpg",
      displayOrder: 3,
    });

    expect(result).toBeDefined();

    const items = await getGalleryItemsByMemorialId(testMemorialId);
    const addedItem = items.find((item) => item.url === "https://example.com/photo2.jpg");

    expect(addedItem).toBeDefined();
    expect(addedItem?.title).toBeNull();
    expect(addedItem?.description).toBeNull();
  });
});
