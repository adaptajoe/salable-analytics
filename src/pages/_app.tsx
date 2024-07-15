import { SWRConfig } from "swr";
import "../globals.css";
import type { AppProps } from "next/app";

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((r) => r.json());

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
