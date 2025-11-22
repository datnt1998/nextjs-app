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
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
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
          <Button variant="default">Action</Button>
        </CardFooter>
      </>
    ),
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card with Content</CardTitle>
          <CardDescription>This card has various content</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content area with text and elements.</p>
        </CardContent>
      </>
    ),
  },
};
