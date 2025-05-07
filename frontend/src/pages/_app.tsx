import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChatProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChatProvider>
    </AuthProvider>
  );
}

export default MyApp;
