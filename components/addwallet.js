import React, { useState } from "react";
import { useManageAddress } from "./ManageAddressContext";
import axios from 'axios';
import Price from "./Price";
import styles from './AddWallet.module.css'
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const AddWallet = () => {
  const { isConnected } = useAccount();
  const { walletAddresses, addWalletAddress, removeWalletAddress } = useManageAddress();
  const [newAddress, setNewAddress] = useState("");
  const [walletData, setWalletData] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const fetchWalletDetails = async (address) => {
    try {
      const response = await axios.get("https://wallettrackerbackend.onrender.com/getwalletbalance",
      {
        params: { address },
      }
      );

      const walletDetails = response.data.filteredTokenArray;
      console.log(walletDetails);
      console.log(walletDetails)
      setWalletData((prevData) => [...prevData, { address, balances: walletDetails }]);
      setShowResult(true);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim() !== "") {
      addWalletAddress(newAddress.trim());
      setNewAddress("");
      fetchWalletDetails(newAddress);
    }
  };

  const handleRemoveAddress = (address) => {
    // Remove the address and its balances
    removeWalletAddress(address);
    setWalletData((prevData) => prevData.filter((data) => data.address !== address));
  };

  return (
    <>
    <div className={styles.container}>
      <h2>Add/Remove Wallet Addresses</h2>
      
      {isConnected ? (
        <div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
            <button
              onClick={handleAddAddress}
              className={styles.addAddressButton}  
            >
              Add Address
            </button>
          </div>
          {walletData.map(({ address, balances }) => (
            <div key={address} className={styles.walletContainer}>
              <h3>{address}
             
              <button onClick={() => handleRemoveAddress(address)}>
                Remove Address
              </button></h3>
              {balances.length > 0 && <Price balances={balances} />}
              
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.centeredContainer}>
        <h3>Please connect your wallet.</h3>
        <ConnectButton />
      </div>

        
      )}
    </div>
    </>
  );
};

export default AddWallet;
