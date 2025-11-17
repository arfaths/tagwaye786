"use client";

import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Timeline } from "../components/chrome/Timeline";
import { useLayoutStore } from "../state/layout-store";
import "../app/globals.css";

const queryClient = new QueryClient();

const withProviders: Decorator = (StoryComponent) => (
  <QueryClientProvider client={queryClient}>
    <div style={{ width: "1440px", margin: "0 auto" }}>
      <StoryComponent />
    </div>
  </QueryClientProvider>
);

const meta: Meta<typeof Timeline> = {
  title: "Chrome/Timeline",
  component: Timeline,
  decorators: [withProviders],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Collapsed: Story = {
  render: () => {
    useLayoutStore.setState({
      timelineVisible: true,
      timelineExpanded: false,
    });
    return <Timeline />;
  },
};

export const Expanded: Story = {
  render: () => {
    useLayoutStore.setState({
      timelineVisible: true,
      timelineExpanded: true,
    });
    return <Timeline />;
  },
};

