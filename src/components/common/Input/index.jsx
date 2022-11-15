import React from "react";
import styles from "./index.module.scss";

const Input = ({ label, textarea, ...props }) => {  //: any
  // console.log("kk:", JSON.stringify(props));
  return (
    <div className={styles.container}>
      <div className={styles.container__label}>{label}</div>
      {!textarea && (
        <input
          {...props}
          className={`${styles.container__input} ${props.className}`}
        />
      )}
      {textarea && (
        <textarea className={`${styles.container__input} ${props.className}`} defaultValue={props.value}>
          {/* {props.value} */}
        </textarea>
      )}
    </div>
  );
};

export default Input;
