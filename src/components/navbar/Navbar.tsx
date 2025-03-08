"use client"

import styles from "./navbar.module.css";
import Image from 'next/image';
import Link from "next/link"

const Navbar = () => {

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.logo}>Team-14</Link>
            <Image
                src="/compugroup.png"
                alt="CompuGroup Medical"
                width={150}
                height={80}
                className={styles.logo}
            />
        </div>
    )
}

export default Navbar