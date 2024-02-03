// WatchlistContext.js
import React, { createContext, useContext, useState } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const addToWatchlist = (token) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, token]);
  };

  const removeFromWatchlist = (token) => {
    setWatchlist((prevWatchlist) =>
      prevWatchlist.filter((t) => t !== token)
    );
  };

  const isTokenInWatchlist = (token) => {
    return watchlist.includes(token);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isTokenInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  return useContext(WatchlistContext);
};