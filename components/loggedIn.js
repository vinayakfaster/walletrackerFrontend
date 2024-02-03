import { useEffect, useState } from "react";
import axios from 'axios';
import Price from "./Price"; 
const styles = require("./LoggedIn.module.css");
import { useAccount } from "wagmi";

export default function LoggedIn() {
  const address = "0x4e6FB88e48711d9f692942304D48A3aFc843e99A";
  const [balances, setBalances] = useState([]);
  const [nativebalance, setnativebalance] = useState(null); 
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the first request
        const response = await axios.get(
          "https://wallettrackerbackend.onrender.com/getwalletbalance",
          {
            params: { address },
          }
        );
        console.log(response.data);

       
        setBalances(response.data.filteredTokenArray);
        // setnativebalance(response2.data); 
        setShowResult(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    
  }, [address]);

  return (
    <>
    <section className={styles.loggedIn_container}>
      <p>Potfolio Data: ${JSON.stringify(nativebalance)}</p>

      {showResult && balances.length > 0 && (
        <>
          <Price balances={balances} />
     
        </>
      )}
    </section>
    </>
  );
}
