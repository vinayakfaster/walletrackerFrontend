// ManageAddressContext.js
import React, { createContext, useContext, useState } from "react";

const ManageAddressContext = createContext();

export const ManageAddressProvider = ({ children }) => {
  const [walletAddresses, setWalletAddresses] = useState([]);

  const addWalletAddress = (address) => {
    setWalletAddresses((prevAddresses) => [...prevAddresses, address]);
  };

  const removeWalletAddress = (address) => {
    setWalletAddresses((prevAddresses) =>
      prevAddresses.filter((a) => a !== address)
    );
  };

  return (
    <ManageAddressContext.Provider
      value={{
        walletAddresses,
        addWalletAddress,
        removeWalletAddress,
      }}
    >
      {children}
    </ManageAddressContext.Provider>
  );
};

export const useManageAddress = () => {
  const context = useContext(ManageAddressContext);
  if (!context) {
    throw new Error('useManageAddress must be used within a ManageAddressProvider');
  }
  return context;
};