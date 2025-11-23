# Custom Components

Custom-built components extending base UI with additional functionality.

## LoadingButton

Button with built-in loading state and icon support.

**Features:**

- Loading state with spinner
- Optional loading text
- Icon support (left/right)
- Extends base Button
- Auto-disables during loading

**Usage:**

```tsx
import { LoadingButton } from "@/components/shared/custom";
import { Save } from "lucide-react";

<LoadingButton loading={isLoading} onClick={handleSubmit}>
  Submit
</LoadingButton>

<LoadingButton loading={isLoading} loadingText="Saving...">
  Save
</LoadingButton>

<LoadingButton icon={<Save className="h-4 w-4" />}>
  Save
</LoadingButton>
```

**Props:**

- `loading` - Shows spinner, disables button
- `icon` - Icon to display (hidden during loading)
- `iconPosition` - "left" | "right" (default: "left")
- `loadingText` - Custom loading text
- All Button props (variant, size, etc.)

## InputWithAddons

Input field with optional leading/trailing addons.

**Features:**

- Leading and trailing addon support
- Uses core Input component
- Flexible addon content
- Proper focus states

**Usage:**

```tsx
import { InputWithAddons } from "@/components/shared/custom";
import { DollarSign } from "lucide-react";

<InputWithAddons
  leading={<DollarSign className="h-4 w-4" />}
  placeholder="0.00"
  type="number"
/>

<InputWithAddons
  trailing=".com"
  placeholder="example"
/>

<InputWithAddons
  leading="https://"
  trailing=".com"
  placeholder="example"
/>
```

**Props:**

- `leading` - Content before input
- `trailing` - Content after input
- `containerClassName` - Container CSS classes
- `className` - Input CSS classes
- All standard input props

## TextWithTooltip

Smart text component with automatic tooltip on truncation.

**Features:**

- Auto-detects truncation
- Shows tooltip only when truncated
- ResizeObserver for responsive behavior
- Optimized performance
- Accessible with Radix UI

**Usage:**

```tsx
import { TextWithTooltip } from "@/components/shared/custom";

<div className="w-[200px]">
  <TextWithTooltip
    text="Very long text that will be truncated"
    className="text-sm font-medium"
  />
</div>;
```

**Props:**

- `text` - Text content (string | number)
- `className` - CSS classes

**How it works:**

1. Uses ResizeObserver to detect truncation
2. Compares scrollWidth with clientWidth
3. Enables tooltip only when truncated
4. Auto-updates on resize/text changes
5. Cleans up observers on unmount

## PasswordInput

Password input with show/hide toggle.

**Features:**

- Show/hide password toggle
- Uses Tabler icons
- Hides browser's native reveal
- Disabled when empty
- Accessible

**Usage:**

```tsx
import { PasswordInput } from "@/components/shared/custom";

<PasswordInput
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>;
```

**Props:**

- All standard input props
- `value`, `onChange`, `placeholder`, `disabled`, `className`, `ref`

## Adding Components

When adding new custom components:

1. Create component file
2. Export from `index.ts`
3. Add to component showcase
4. Update this README
5. Follow patterns:
   - TypeScript types
   - Accessibility
   - Tailwind styling
   - Tabler icons

## Guidelines

- Use Tabler icons for consistency
- Extend base UI components
- Include proper TypeScript types
- Add accessibility features
- Follow existing code style
- Document props and usage
