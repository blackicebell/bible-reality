import { ReactNode } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

export default function RootHtml({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <ScrollViewStyleReset />
        <style>{`
          html,
          body,
          #root {
            margin: 0;
            max-width: 100%;
            min-width: 0;
            overflow-x: hidden;
            width: 100%;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
