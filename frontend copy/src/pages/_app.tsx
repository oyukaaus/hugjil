import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { SharedStateProvider } from "@/context/SharedStateContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChatProvider>
        <SharedStateProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SharedStateProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default MyApp;
