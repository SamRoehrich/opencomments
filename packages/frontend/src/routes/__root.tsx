import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "OpenComments - Contextual Feedback Made Simple",
      },
      {
        name: "description",
        content: "Leave contextual feedback directly on any webpage. No screenshots, no confusion. Comment on any element and collaborate with your team seamlessly.",
      },
      {
        name: "keywords",
        content: "feedback, comments, design review, collaboration, web feedback, contextual comments, open source",
      },
      {
        name: "author",
        content: "OpenComments",
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "OpenComments - Contextual Feedback Made Simple",
      },
      {
        property: "og:description",
        content: "Leave contextual feedback directly on any webpage. No screenshots, no confusion. Comment on any element and collaborate with your team seamlessly.",
      },
      {
        property: "og:url",
        content: "https://opencomments.dev",
      },
      {
        property: "og:site_name",
        content: "OpenComments",
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "OpenComments - Contextual Feedback Made Simple",
      },
      {
        name: "twitter:description",
        content: "Leave contextual feedback directly on any webpage. No screenshots, no confusion. Comment on any element and collaborate with your team seamlessly.",
      },
      // Theme
      {
        name: "theme-color",
        content: "#2563eb",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
