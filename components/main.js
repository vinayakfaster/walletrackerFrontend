import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import LoggedIn from "../components/loggedIn";
import QuestionMark from "../public/assets/question.png";

export default function Header() {
  const { isConnected } = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isConnected]);

  function modal() {
    setShowModal(!showModal);
  }

  return (
    <section className={styles.main_container}>
      <section className={styles.main_helper}>
        <a onClick={modal}>
          <Image
            src={QuestionMark}
            alt="Question Mark image"
            width="35"
            height="35"
            className={styles.questionMark}
            id="questionMark"
          />
        </a>
      </section>
      {isLoggedIn ? (
        <section className={styles.ConnectButton_section}>
          <h1 className={styles.title}>Portfolio Manager</h1>
          <ConnectButton />
        </section>
      ) : (
        <LoggedIn />
      )}
      </section>

  );
}
