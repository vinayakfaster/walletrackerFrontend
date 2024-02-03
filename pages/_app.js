import "../styles/globals.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { WatchlistProvider } from "../components/WatchlistContext";
import { ManageAddressProvider  } from "../components/ManageAddressContext";
import ShowPrice from "../components/showprice";
import TokenDetail from "../components/TokenDetail";
import TokenPools from "../components/TokenPools";
import TokenValueCalculator from "../components/TokenValueCalculator";
import PieChart from "../components/PieChart";
import MutualToken from "../components/MutualToken";
import ohlcv from "../components/OHLCV";
import TradingChart from "../components/TradingChart";

const { chains, provider } = configureChains(
  [goerli, mainnet, polygon],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "Firebase Web3 Wallet Tracker",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
      <WatchlistProvider>
        <ManageAddressProvider >
        <Component {...pageProps} />
        <ShowPrice>
          <TokenDetail >
            <TokenPools>
              <TokenValueCalculator>
                <PieChart>
      <MutualToken>
        
      </MutualToken>

                  <ohlcv>
                  <TradingChart></TradingChart>
                  </ohlcv>
                </PieChart>
              </TokenValueCalculator>
            </TokenPools>
          </TokenDetail>          
        </ShowPrice>
        </ManageAddressProvider>
        </WatchlistProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
