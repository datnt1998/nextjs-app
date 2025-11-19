import { Archive, ChevronDown, Info, Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Grid } from "@/components/ui/grid";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Section } from "@/components/ui/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Stack } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: string;
  component: ReactNode;
}

export const componentRegistry: ComponentExample[] = [
  // Form Components
  {
    id: "button",
    name: "Button",
    description: "Clickable button with multiple variants and sizes",
    category: "form",
    component: (
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    ),
  },
  {
    id: "button-group",
    name: "Button Group",
    description: "Group of related buttons",
    category: "form",
    component: (
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    ),
  },
  {
    id: "input",
    name: "Input",
    description: "Text input field for user data entry",
    category: "form",
    component: <Input placeholder="Enter text..." />,
  },
  {
    id: "input-group",
    name: "Input Group",
    description: "Input with prefix/suffix addons",
    category: "form",
    component: (
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search className="h-4 w-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
    ),
  },
  {
    id: "input-otp",
    name: "Input OTP",
    description: "One-time password input with individual slots",
    category: "form",
    component: (
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  {
    id: "textarea",
    name: "Textarea",
    description: "Multi-line text input field",
    category: "form",
    component: <Textarea placeholder="Type your message here..." rows={3} />,
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Checkbox for binary choices",
    category: "form",
    component: (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    ),
  },
  {
    id: "radio-group",
    name: "Radio Group",
    description: "Radio buttons for single selection",
    category: "form",
    component: (
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-two">Option Two</Label>
        </div>
      </RadioGroup>
    ),
  },
  {
    id: "select",
    name: "Select",
    description: "Dropdown selection menu",
    category: "form",
    component: (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "switch",
    name: "Switch",
    description: "Toggle switch for on/off states",
    category: "form",
    component: (
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
    ),
  },
  {
    id: "slider",
    name: "Slider",
    description: "Range slider for value selection",
    category: "form",
    component: (
      <Slider defaultValue={[50]} max={100} step={1} className="w-[200px]" />
    ),
  },

  // Display Components
  {
    id: "card",
    name: "Card",
    description: "Container for grouping content",
    category: "display",
    component: (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This is the card content area.</p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    description: "Small label for status or categories",
    category: "display",
    component: (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    ),
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "User profile picture or initials",
    category: "display",
    component: (
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    id: "alert",
    name: "Alert",
    description: "Important messages and notifications",
    category: "display",
    component: (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational alert message.
        </AlertDescription>
      </Alert>
    ),
  },
  {
    id: "empty",
    name: "Empty State",
    description: "Display when no content is available",
    category: "display",
    component: (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Archive className="h-6 w-6" />
          </EmptyMedia>
          <EmptyTitle>No items found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or search criteria
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    ),
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description: "Loading placeholder animation",
    category: "display",
    component: (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ),
  },
  {
    id: "spinner",
    name: "Spinner",
    description: "Loading indicator",
    category: "display",
    component: (
      <div className="flex gap-4 items-center">
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </div>
    ),
  },
  {
    id: "progress",
    name: "Progress",
    description: "Progress indicator bar",
    category: "display",
    component: <Progress value={60} className="w-[200px]" />,
  },
  {
    id: "kbd",
    name: "Keyboard Key",
    description: "Keyboard shortcut display",
    category: "display",
    component: (
      <div className="flex gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
    ),
  },
  {
    id: "separator",
    name: "Separator",
    description: "Visual divider between content",
    category: "display",
    component: (
      <div className="space-y-2">
        <div>Above</div>
        <Separator />
        <div>Below</div>
      </div>
    ),
  },

  // Overlay Components
  {
    id: "dialog",
    name: "Dialog",
    description: "Modal dialog window",
    category: "overlay",
    component: (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>This is a dialog description.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Dialog content goes here.</p>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    description: "Confirmation dialog with actions",
    category: "overlay",
    component: (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    id: "popover",
    name: "Popover",
    description: "Floating content panel",
    category: "overlay",
    component: (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium">Popover Title</h4>
            <p className="text-sm text-muted-foreground">
              Popover content goes here.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description: "Contextual information on hover",
    category: "overlay",
    component: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tooltip content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "hover-card",
    name: "Hover Card",
    description: "Rich content on hover",
    category: "overlay",
    component: (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@username</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@username</h4>
            <p className="text-sm text-muted-foreground">
              User bio and information here.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Menu with multiple options",
    category: "overlay",
    component: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Menu <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },

  // Navigation Components
  {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed navigation interface",
    category: "navigation",
    component: (
      <Tabs defaultValue="tab1" className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="p-4">
          Content for Tab 1
        </TabsContent>
        <TabsContent value="tab2" className="p-4">
          Content for Tab 2
        </TabsContent>
        <TabsContent value="tab3" className="p-4">
          Content for Tab 3
        </TabsContent>
      </Tabs>
    ),
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Navigation breadcrumb trail",
    category: "navigation",
    component: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  {
    id: "pagination",
    name: "Pagination",
    description: "Page navigation controls",
    category: "navigation",
    component: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },

  // Data Display
  {
    id: "table",
    name: "Table",
    description: "Data table display",
    category: "data",
    component: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Collapsible content sections",
    category: "data",
    component: (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content for section 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content for section 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    id: "collapsible",
    name: "Collapsible",
    description: "Expandable content container",
    category: "data",
    component: (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline">Toggle Content</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 p-4 border rounded">
          <p className="text-sm">
            This is collapsible content that can be shown or hidden.
          </p>
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Date picker calendar",
    category: "data",
    component: <Calendar mode="single" className="rounded-md border" />,
  },

  // Layout Components
  {
    id: "container",
    name: "Container",
    description: "Responsive content container",
    category: "layout",
    component: (
      <Container>
        <p className="text-sm">
          Content within a container with max-width constraints.
        </p>
      </Container>
    ),
  },
  {
    id: "section",
    name: "Section",
    description: "Content section wrapper",
    category: "layout",
    component: (
      <Section>
        <p className="text-sm">Content within a section element.</p>
      </Section>
    ),
  },
  {
    id: "grid",
    name: "Grid",
    description: "Grid layout system",
    category: "layout",
    component: (
      <Grid cols={3} gap="sm">
        <div className="p-4 bg-muted rounded">Item 1</div>
        <div className="p-4 bg-muted rounded">Item 2</div>
        <div className="p-4 bg-muted rounded">Item 3</div>
      </Grid>
    ),
  },
  {
    id: "stack",
    name: "Stack",
    description: "Vertical or horizontal stack",
    category: "layout",
    component: (
      <Stack direction="vertical" gap="sm">
        <div className="p-2 bg-muted rounded">Item 1</div>
        <div className="p-2 bg-muted rounded">Item 2</div>
        <div className="p-2 bg-muted rounded">Item 3</div>
      </Stack>
    ),
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    description: "Scrollable content area",
    category: "layout",
    component: (
      <ScrollArea className="h-[100px] w-full rounded-md border p-4">
        <div className="space-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={`scroll-item-${i}`} className="text-sm">
              Scrollable item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
  },
  {
    id: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Maintain aspect ratio container",
    category: "layout",
    component: (
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
        <div className="flex h-full items-center justify-center text-sm">
          16:9 Aspect Ratio
        </div>
      </AspectRatio>
    ),
  },

  // Interactive Components
  {
    id: "toggle",
    name: "Toggle",
    description: "Toggle button state",
    category: "interactive",
    component: <Toggle aria-label="Toggle italic">Toggle</Toggle>,
  },
  {
    id: "toggle-group",
    name: "Toggle Group",
    description: "Group of toggle buttons",
    category: "interactive",
    component: (
      <ToggleGroup type="single">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
];
