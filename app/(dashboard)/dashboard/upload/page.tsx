import { Container } from "@/components/ui/container";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { ImageUploadForm } from "@/components/upload/image-upload-form";

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
