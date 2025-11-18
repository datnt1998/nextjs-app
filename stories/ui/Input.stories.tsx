import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "underline", "filled", "ghost"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    placeholder: "Enter text...",
  },
};

export const Underline: Story = {
  args: {
    variant: "underline",
    placeholder: "Enter text...",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    placeholder: "Enter text...",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    placeholder: "Enter text...",
  },
};

export const WithValue: Story = {
  args: {
    variant: "default",
    defaultValue: "Sample text",
  },
};

export const Disabled: Story = {
  args: {
    variant: "default",
    placeholder: "Disabled input",
    disabled: true,
  },
};
