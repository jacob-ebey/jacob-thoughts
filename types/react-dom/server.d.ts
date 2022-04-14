declare module "react-dom/server" {
  import type { Writable } from "stream";

  export function renderToPipeableStream(
    initialChildren: React.ReactChild | Iterable<React.ReactNode>,
    config: {
      onAllReady?(): void;
      onShellReady?(): void;
      onShellError?(error: Error): void;
      onError?(error: Error): void;
    }
  ): { pipe(writeable: Writable): void; abort(): void };
}
