"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./Abacus.module.css";

const COLUMNS = [1, 2, 3, 4, 5, 6, 7];

function asHtml(elements: NodeListOf<Element> | null) {
  return elements ? (Array.from(elements) as HTMLElement[]) : [];
}

export default function Plus() {
  const [count] = useState(0);
  const one = useRef<HTMLElement[]>([]);
  const two = useRef<HTMLElement[]>([]);
  const three = useRef<HTMLElement[]>([]);
  const four = useRef<HTMLElement[]>([]);
  const five = useRef<HTMLElement[]>([]);

  useEffect(() => {
    one.current = asHtml(document.querySelectorAll(".one"));
    two.current = asHtml(document.querySelectorAll(".two"));
    three.current = asHtml(document.querySelectorAll(".three"));
    four.current = asHtml(document.querySelectorAll(".four"));
    five.current = asHtml(document.querySelectorAll(".five"));

    one.current.forEach((item) => {
      item.style.bottom = "0";
    });
    two.current.forEach((item) => {
      item.style.bottom = "36px";
    });
    three.current.forEach((item) => {
      item.style.bottom = "72px";
    });
    four.current.forEach((item) => {
      item.style.bottom = "108px";
    });
    five.current.forEach((item) => {
      item.style.top = "0";
    });
  }, []);

  const validations = (e: MouseEvent<HTMLDivElement>, which: number) => {
    const data = Number(e.currentTarget.id.slice(-1));
    const id = e.currentTarget.id;

    if (id === `four${which}`) {
      if (four.current[data]?.style.bottom === "144px") {
        four.current[data].style.bottom = "108px";
        three.current[data].style.bottom = "72px";
        two.current[data].style.bottom = "36px";
        one.current[data].style.bottom = "0px";
        return;
      }
      four.current[data].style.bottom = "144px";
    }

    if (id === `three${which}`) {
      if (three.current[data]?.style.bottom === "108px") {
        three.current[data].style.bottom = "72px";
        two.current[data].style.bottom = "36px";
        one.current[data].style.bottom = "0px";
        return;
      }
      four.current[data].style.bottom = "144px";
      three.current[data].style.bottom = "108px";
    }

    if (id === `two${which}`) {
      if (two.current[data]?.style.bottom === "72px") {
        two.current[data].style.bottom = "36px";
        one.current[data].style.bottom = "0px";
        return;
      }
      four.current[data].style.bottom = "144px";
      three.current[data].style.bottom = "108px";
      two.current[data].style.bottom = "72px";
    }

    if (id === `one${which}`) {
      if (one.current[data]?.style.bottom === "36px") {
        one.current[data].style.bottom = "0px";
        return;
      }
      four.current[data].style.bottom = "144px";
      three.current[data].style.bottom = "108px";
      two.current[data].style.bottom = "72px";
      one.current[data].style.bottom = "36px";
    }

    if (id === `five${which}`) {
      if (five.current[data]?.style.top === "36px") {
        five.current[data].style.top = "0px";
        return;
      }
      five.current[data].style.top = "36px";
    }
  };

  return (
    <div className={styles.container}>
      {[...COLUMNS].reverse().map((_, index) => (
        <div key={index}>
          <div className={styles.pack}>
            <div
              onClick={(e) => validations(e, index)}
              id={`five${index}`}
              className={`${styles.nut} five`}
            />
            <div className={styles.pipe} />
            <div
              onClick={(e) => validations(e, index)}
              id={`four${index}`}
              className={`${styles.nut} four`}
            />
            <div
              onClick={(e) => validations(e, index)}
              id={`three${index}`}
              className={`${styles.nut} three`}
            />
            <div
              onClick={(e) => validations(e, index)}
              id={`two${index}`}
              className={`${styles.nut} two`}
            />
            <div
              onClick={(e) => validations(e, index)}
              id={`one${index}`}
              className={`${styles.nut} one`}
            />
          </div>
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
}
