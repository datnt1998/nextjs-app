# Image Upload Component

A comprehensive image upload component with real-time transformations powered by ImageKit.

## Features

- **File Upload**: Upload images with drag-and-drop or file selection
- **File Validation**: Validates file type and size before upload
- **Preview**: Shows preview of selected image before upload
- **LQIP (Low Quality Image Placeholder)**: Progressive image loading with blur effect
- **Real-time Transformations**: Displays multiple transformation examples
- **Signed Upload**: Secure server-side signed uploads to ImageKit

## Usage

### Basic Usage

```tsx
import { ImageUploadForm } from "@/components/upload";

export default function UploadPage() {
  return <ImageUploadForm folder="/uploads" maxSizeMB={10} />;
}
```

### With Upload Callback

```tsx
import { ImageUploadForm } from "@/components/upload";
import type { UploadResponse } from "@/lib/imagekit/upload";

export default function UploadPage() {
  const handleUploadSuccess = (result: UploadResponse) => {
    console.log("Uploaded image:", result);
    // Save to database, update state, etc.
  };

  return (
    <ImageUploadForm
      folder="/products"
      maxSizeMB={5}
      onUploadSuccess={handleUploadSuccess}
    />
  );
}
```

## Props

| Prop              | Type                               | Default      | Description                         |
| ----------------- | ---------------------------------- | ------------ | ----------------------------------- |
| `onUploadSuccess` | `(result: UploadResponse) => void` | `undefined`  | Callback fired when upload succeeds |
| `folder`          | `string`                           | `"/uploads"` | ImageKit folder path for uploads    |
| `maxSizeMB`       | `number`                           | `10`         | Maximum file size in megabytes      |

## File Validation

The component validates:

- **File Type**: JPEG, PNG, WebP, GIF
- **File Size**: Configurable maximum size (default 10MB)

## Transformation Examples

After upload, the component displays the following transformations:

1. **Original with LQIP**: Full-size image with progressive loading
2. **Thumbnail**: 200×200px with maintained aspect ratio
3. **WebP Format**: Converted to WebP format
4. **Blurred**: Applied blur effect
5. **Low Quality**: Reduced quality for smaller file size
6. **Cropped**: Force-cropped to square
7. **High Quality**: Maximum quality output

## API Routes

The component uses the following API routes:

- `GET /api/imagekit/auth` - Get signed upload parameters
- `DELETE /api/imagekit/delete` - Delete uploaded files
- `GET /api/imagekit/file/[fileId]` - Get file details

## ImageKit Configuration

Ensure your `.env.local` has the following variables:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
IMAGEKIT_PRIVATE_KEY=your-private-key
```

## Example Page

A complete example is available at `/dashboard/upload` which demonstrates:

- File selection and validation
- Upload progress
- LQIP placeholder during loading
- Multiple transformation examples
- Image details display

## Related Components

- `buildImageUrl()` - Build transformed image URLs
- `buildLQIP()` - Generate low-quality placeholders
- `uploadFile()` - Upload files to ImageKit
- `validateFile()` - Validate files before upload
