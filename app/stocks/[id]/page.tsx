import React from "react";
import styles from "./page.module.css";

type Props = {
    params: {
        id: string;
    };
};

const Page = ({ params }: Props) => {
    return (
        <main>
            <section className={styles.wrapper}>Stocks {params.id}</section>
        </main>
    );
};

export default Page;
