import FeedScreen from "@/components/feed/FeedScreen";
import FeedInitProvider from "@/providers/FeedInitProvider";
import React from "react";

export default function Feed() {
  return (
    <FeedInitProvider>
      <FeedScreen />
    </FeedInitProvider>
  );
}
