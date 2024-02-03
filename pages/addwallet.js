import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Header from "../components/header";
import Addwallet from '../components/addwallet'; // Import the addwallet component

export default function addwallet() {
  return (
    <section className={styles.container}>

      <main className={styles.main}>
        <Header />
        <Addwallet>
          </Addwallet>
      </main>
    </section>
  );
}