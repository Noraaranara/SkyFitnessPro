import { ReactNode } from "react";
import styles from './layout.module.css'
import Header from "@/components/Header/Header";

interface pageLayoutProps {
  children: ReactNode;
}

export default function pageLayout({ children }: pageLayoutProps) {
  return (
    <>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Header />
          {children}
        </main>
      </div>
    </div>
    </>
  )
}