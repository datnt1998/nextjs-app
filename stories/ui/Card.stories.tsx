import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outline", "glass", "gradient-border"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area.</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>This card has an elevated shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with elevated styling.</p>
        </CardContent>
      </>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: (
      <>
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>This card has a border outline</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with outline styling.</p>
        </CardContent>
      </>
    ),
  },
};

export const Glass: Story = {
  args: {
    variant: "glass",
    children: (
      <>
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>
            This card has a glass morphism effect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with glass styling.</p>
        </CardContent>
      </>
    ),
  },
};

export const GradientBorder: Story = {
  args: {
    variant: "gradient-border",
    children: (
      <>
        <CardHeader>
          <CardTitle>Gradient Border Card</CardTitle>
          <CardDescription>This card has a gradient border</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with gradient border styling.</p>
        </CardContent>
      </>
    ),
  },
};
