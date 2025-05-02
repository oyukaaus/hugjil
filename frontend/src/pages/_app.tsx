// pages/_app.tsx
import { AppProps } from "next/app";
import Layout from "@/components/Layout"; // Adjust the path based on your structure
import "@/styles/globals.css"; // Import your global styles
import { AuthProvider } from "@/context/AuthContext"; // Import the AuthProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
