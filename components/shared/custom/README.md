# Custom Components

This folder contains custom-built components that extend the base UI components with additional functionality.

## Components

### TextWithTooltip

A smart text component that automatically shows a tooltip when the text is truncated.

**Features:**

- Automatically detects text truncation
- Shows tooltip only when text is truncated
- Uses ResizeObserver for responsive behavior
- Optimized performance with proper cleanup
- Fully accessible with Radix UI Tooltip
- Supports both string and number values

**Usage:**

```tsx
import { TextWithTooltip } from "@/components/shared/custom";

function ProductList() {
  return (
    <div className="w-[200px]">
      <TextWithTooltip
        text="This is a very long product name that will be truncated"
        className="text-sm font-medium"
      />
    </div>
  );
}
```

**Props:**

- `text` (required): `string | number` - The text content to display
- `className` (optional): `string` - Additional CSS classes for styling

**How it works:**

1. Uses `ResizeObserver` to detect when text is truncated
2. Compares `scrollWidth` with `clientWidth` to determine truncation
3. Only enables tooltip when text is actually truncated
4. Automatically updates on resize or text changes
5. Cleans up observers on unmount

**Styling:**

The component applies `truncate` class by default and disables pointer events when not truncated to prevent unnecessary tooltip triggers.

---

### PasswordInput

A password input field with a toggle button to show/hide the password.

**Features:**

- Show/hide password toggle button
- Uses Tabler icons (IconEye, IconEyeOff)
- Hides browser's native password reveal button
- Disabled state when input is empty
- Accessible with screen reader support
- Fully typed with TypeScript

**Usage:**

```tsx
import { PasswordInput } from "@/components/shared/custom";

function LoginForm() {
  const [password, setPassword] = useState("");

  return (
    <PasswordInput
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
}
```

**Props:**

Accepts all standard HTML input props (`React.ComponentProps<"input">`):

- `value` - The input value
- `onChange` - Change handler
- `placeholder` - Placeholder text
- `disabled` - Disable the input
- `className` - Additional CSS classes
- `ref` - Forward ref to the input element
- And all other native input attributes

**Styling:**

The component uses the base `Input` component styling and adds:

- Right padding for the toggle button (`pr-10`)
- Absolute positioned toggle button
- Hover states for the button
- Disabled states

**Accessibility:**

- Toggle button has `aria-hidden="true"` for the icon
- Screen reader text via `sr-only` class
- Proper button type and disabled states
- Keyboard accessible

## Adding New Custom Components

When adding new custom components to this folder:

1. Create the component file (e.g., `my-component.tsx`)
2. Export it from `index.ts`
3. Add it to the component showcase in `component-registry.tsx`
4. Update this README with documentation
5. Follow the existing patterns for:
   - TypeScript types
   - Accessibility
   - Styling with Tailwind
   - Using Tabler icons

## Guidelines

- Use Tabler icons for consistency
- Extend base UI components when possible
- Include proper TypeScript types
- Add accessibility features (ARIA labels, keyboard support)
- Follow the existing code style
- Document props and usage examples
