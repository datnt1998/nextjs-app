import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ImageUploadForm } from "@/components/features/upload/image-upload-form";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Image Upload | Dashboard",
  description: "Upload and transform images with ImageKit",
};

export default function UploadPage() {
  return (
    <DashboardShell>
      <Container size="lg">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Upload</h1>
            <p className="text-muted-foreground mt-2">
              Upload images and see real-time transformations powered by
              ImageKit
            </p>
          </div>

          <ImageUploadForm folder="/uploads" maxSizeMB={10} />
        </div>
      </Container>
    </DashboardShell>
  );
}
