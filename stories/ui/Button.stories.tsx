import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "subtle",
        "soft",
        "danger",
        "gradient",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Subtle: Story = {
  args: {
    variant: "ghost",
    children: "Subtle Button",
  },
};

export const Soft: Story = {
  args: {
    variant: "secondary",
    children: "Soft Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "destructive",
    children: "Danger Button",
  },
};

export const Gradient: Story = {
  args: {
    variant: "default",
    children: "Gradient Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};
