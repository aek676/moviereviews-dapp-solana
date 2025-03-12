import "./globals.css";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { UiLayout } from "@/components/ui/ui-layout";
import { ReactQueryProvider } from "./react-query-provider";
import { UmiProvider } from "@/components/umi/umi-provider";

export const metadata = {
  title: "MovieReviews",
  description: "Generated by create-solana-dapp",
};

const links: { label: string; path: string }[] = [
  // { label: "Account", path: "/account" },
  // { label: "Clusters", path: "/clusters" },
  { label: "MovieReviews Program", path: "/MovieReviews" },
  { label: "Upload Files", path: "/UploadFiles" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UmiProvider>
                <UiLayout links={links}>{children}</UiLayout>
              </UmiProvider>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
