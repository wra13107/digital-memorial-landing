import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Play, Music, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface GalleryItem {
  id: number;
  type: "photo" | "video" | "audio";
  url: string;
  title: string | null;
  description: string | null;
  displayOrder: number;
  createdAt: Date;
}

interface MediaGalleryProps {
  memorialId: number;
  isOwner?: boolean;
}

export function MediaGallery({ memorialId, isOwner = false }: MediaGalleryProps) {
  const [selectedTab, setSelectedTab] = useState<"photo" | "video" | "audio">("photo");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const galleryQuery = trpc.memorials.getGalleryItems.useQuery({ memorialId });
  const deleteItemMutation = trpc.memorials.deleteGalleryItem.useMutation();

  const items = galleryQuery.data || [];
  const photoItems = items.filter((item) => item.type === "photo");
  const videoItems = items.filter((item) => item.type === "video");
  const audioItems = items.filter((item) => item.type === "audio");

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setDeletingId(id);
    try {
      await deleteItemMutation.mutateAsync({
        id,
        memorialId,
      });
      toast.success("Item deleted successfully");
      galleryQuery.refetch();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const renderPhotoItem = (item: GalleryItem) => (
    <div key={item.id} className="relative group">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
        <img
          src={item.url}
          alt={item.title || "Photo"}
          className="w-full h-full object-cover"
        />
      </div>
      {item.title && (
        <p className="text-sm font-medium mt-2 truncate">{item.title}</p>
      )}
      {isOwner && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(item.id)}
          disabled={deletingId === item.id}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {deletingId === item.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );

  const renderVideoItem = (item: GalleryItem) => (
    <div key={item.id} className="relative group">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        <video
          src={item.url}
          className="w-full h-full object-cover"
          controls
        />
      </div>
      {item.title && (
        <p className="text-sm font-medium mt-2 truncate">{item.title}</p>
      )}
      {isOwner && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(item.id)}
          disabled={deletingId === item.id}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {deletingId === item.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );

  const renderAudioItem = (item: GalleryItem) => (
    <div key={item.id} className="bg-accent/50 p-4 rounded-lg flex items-center justify-between group">
      <div className="flex-1 flex items-center gap-3">
        <Music className="w-6 h-6 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-medium">{item.title || "Audio"}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <audio src={item.url} controls className="h-8" />
        {isOwner && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );

  if (galleryQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Media Gallery</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>
          {items.length} items • {photoItems.length} photos • {videoItems.length} videos • {audioItems.length} audio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No media uploaded yet</p>
          </div>
        ) : (
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="photo">
                Photos ({photoItems.length})
              </TabsTrigger>
              <TabsTrigger value="video">
                Videos ({videoItems.length})
              </TabsTrigger>
              <TabsTrigger value="audio">
                Audio ({audioItems.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="mt-4">
              {photoItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No photos uploaded
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photoItems.map(renderPhotoItem)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="video" className="mt-4">
              {videoItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No videos uploaded
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videoItems.map(renderVideoItem)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audio" className="mt-4">
              {audioItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No audio files uploaded
                </p>
              ) : (
                <div className="space-y-2">
                  {audioItems.map(renderAudioItem)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
