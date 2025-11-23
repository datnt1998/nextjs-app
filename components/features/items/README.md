# Items CRUD Module

A complete, production-ready Items CRUD implementation with advanced data table features, built with Next.js 16, Supabase, TanStack Table v8, and ShadCN UI.

## Features

### ✨ Core Functionality

- **Create**: Add new items with form validation and image upload
- **Read**: View items in an advanced data table with pagination
- **Update**: Edit existing items with pre-filled forms
- **Delete**: Remove items with confirmation dialog

### 📊 Data Table Features

- **Server-side pagination** - Efficient handling of large datasets
- **Column sorting** - Sort by title, status, or created date
- **Global search** - Search across title and description fields
- **Status filtering** - Filter by active, inactive, or archived status
- **Column visibility** - Show/hide columns as needed
- **Row selection** - Select multiple items for batch operations
- **Density control** - Adjust table spacing (compact/comfortable/spacious)
- **URL state sync** - All filters and pagination synced to URL using Nuqs
- **Debounced search** - Optimized search with 500ms debounce

### 🎨 UX Features

- **Optimistic UI** - Instant feedback on user actions
- **Loading states** - Skeleton loaders and spinners
- **Toast notifications** - Success/error feedback
- **Responsive design** - Works on all screen sizes
- **Image preview** - Preview images before upload
- **Form validation** - Real-time validation with Zod
- **Accessibility** - ARIA labels and keyboard navigation

## File Structure

```
components/features/items/
├── items-table-columns.tsx      # Table column definitions
├── item-form-dialog.tsx         # Create/Edit form dialog
├── item-delete-dialog.tsx       # Delete confirmation dialog
└── README.md                    # This file

app/[locale]/(dashboard)/dashboard/items/
└── table/
    └── page.tsx                 # Main table page

app/api/items/
├── route.ts                     # GET (list) and POST (create)
└── [id]/
    └── route.ts                 # GET, PATCH, DELETE for single item

lib/api/
└── items.ts                     # Client-side API functions

lib/query-keys/
└── items.ts                     # TanStack Query keys

lib/zod/
└── schemas.ts                   # Validation schemas
```

## Usage

### Accessing the Table

Navigate to `/dashboard/items/table` or use the sidebar navigation:

- Dashboard → Items → Table View

### Creating an Item

1. Click the "Create Item" button in the top-right
2. Fill in the form:
   - **Title** (required): Item name
   - **Description** (optional): Item details (max 500 chars)
   - **Status** (required): active, inactive, or archived
   - **Image** (optional): Upload an image (max 5MB, JPEG/PNG/WebP)
3. Click "Create Item"

### Editing an Item

1. Click the three-dot menu (⋮) in the Actions column
2. Select "Edit Item"
3. Update the fields
4. Click "Update Item"

### Deleting an Item

1. Click the three-dot menu (⋮) in the Actions column
2. Select "Delete Item"
3. Confirm the deletion in the dialog

### Filtering and Searching

- **Search**: Type in the search box to filter by title or description
- **Status Filter**: Click the "Status" button to filter by status
- **Clear Filters**: Click the "Reset" button to clear all filters

### Sorting

Click on column headers (Title, Status, Created) to sort ascending/descending.

### Pagination

- Use the page size dropdown to change items per page (10, 20, 30, 40, 50)
- Navigate pages using the arrow buttons
- Jump to first/last page using the double-arrow buttons

## API Endpoints

### GET /api/items

Fetch items list with pagination and filters.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search query
- `status` - Comma-separated status values
- `sortBy` - Column to sort by (default: created_at)
- `sortOrder` - Sort direction: asc or desc (default: desc)

**Response:**

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### POST /api/items

Create a new item.

**Request Body:**

```json
{
  "title": "Item Title",
  "description": "Item description",
  "status": "active",
  "image_url": "https://..."
}
```

### GET /api/items/[id]

Fetch a single item by ID.

### PATCH /api/items/[id]

Update an item.

**Request Body:** (all fields optional)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "inactive",
  "image_url": "https://..."
}
```

### DELETE /api/items/[id]

Delete an item.

## Database Schema

The items table in Supabase:

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'archived')),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Permissions

The following permissions are required:

- `items:view` - View items list
- `items:create` - Create new items
- `items:update` - Edit existing items
- `items:delete` - Delete items

Permissions are enforced at the API level using RBAC middleware.

## State Management

### TanStack Query

- Automatic caching and invalidation
- Optimistic updates
- Background refetching
- Error handling

### Nuqs (URL State)

- All table state synced to URL
- Shareable URLs with filters
- Browser back/forward support
- Compact URL format

### React Hook Form

- Form state management
- Real-time validation
- Error handling
- Dirty state tracking

## Image Upload

Images are uploaded to ImageKit with the following configuration:

- **Max size**: 5MB
- **Formats**: JPEG, PNG, WebP
- **Folder**: `/items`
- **Unique filenames**: Enabled

The upload process:

1. Client validates file
2. Client requests auth token from `/api/imagekit/auth`
3. Client uploads directly to ImageKit
4. ImageKit returns the file URL
5. URL is saved with the item

## Internationalization

All text is internationalized using next-intl. Translation keys are in:

- `messages/en/items.json`
- `messages/vi/items.json`

Supported languages:

- English (en)
- Vietnamese (vi)

## Customization

### Adding New Columns

1. Update the database schema
2. Update `types/database.types.ts`
3. Add column definition in `items-table-columns.tsx`
4. Update the form in `item-form-dialog.tsx`
5. Update validation schema in `lib/zod/schemas.ts`

### Adding New Filters

1. Add filter field to `filterFields` array in `page.tsx`
2. Add filter component in the toolbar
3. Update API to handle the new filter parameter

### Changing Table Behavior

Edit the `useDataTable` hook options in `page.tsx`:

- `manualPagination` - Enable/disable server-side pagination
- `manualSorting` - Enable/disable server-side sorting
- `manualFiltering` - Enable/disable server-side filtering
- `enableRowSelection` - Enable/disable row selection
- `debounceMs` - Adjust search debounce delay

## Performance Optimization

- **Server-side pagination** - Only fetch needed data
- **Debounced search** - Reduce API calls
- **React Query caching** - Minimize redundant requests
- **Optimistic updates** - Instant UI feedback
- **Image optimization** - Next.js Image component with lazy loading
- **Code splitting** - Dynamic imports for dialogs

## Troubleshooting

### Items not loading

- Check Supabase connection
- Verify RLS policies are configured
- Check browser console for errors
- Verify user has `items:view` permission

### Image upload failing

- Verify ImageKit credentials in `.env.local`
- Check file size (max 5MB)
- Verify file format (JPEG/PNG/WebP)
- Check `/api/imagekit/auth` endpoint

### Filters not working

- Check URL parameters
- Verify API is receiving filter params
- Check browser console for errors

### Permission errors

- Verify user role and permissions
- Check JWT token contains correct claims
- Verify RBAC middleware is configured

## Testing

To test the Items CRUD:

1. **Create**: Create items with various statuses and images
2. **Read**: Test pagination, sorting, and filtering
3. **Update**: Edit items and verify changes persist
4. **Delete**: Delete items and verify they're removed
5. **Search**: Test search with various queries
6. **Filters**: Test status filters and combinations
7. **URL State**: Copy URL and open in new tab to verify state persistence

## Future Enhancements

Potential improvements:

- [ ] Bulk operations (delete multiple items)
- [ ] Export to CSV/Excel
- [ ] Advanced filters (date range, custom fields)
- [ ] Drag-and-drop image upload
- [ ] Image gallery view
- [ ] Item duplication
- [ ] Activity log/audit trail
- [ ] Keyboard shortcuts
- [ ] Column resizing
- [ ] Saved filter presets

## Dependencies

Key dependencies used:

- `@tanstack/react-table` - Table functionality
- `@tanstack/react-query` - Data fetching and caching
- `nuqs` - URL state management
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration
- `sonner` - Toast notifications
- `date-fns` - Date formatting
- `next-intl` - Internationalization

## Support

For issues or questions:

1. Check this README
2. Review the code comments
3. Check the project documentation
4. Open an issue on GitHub
