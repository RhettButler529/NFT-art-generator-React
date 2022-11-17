import engine from "../../engine";
// import InitialState from "../../redux/types/initialStates";
import web3 from "../../services/web3";
import React, { useEffect } from "react";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import Button from "../common/Button";
import Input from "../common/Input";
import styles from "./index.module.scss";
// import { Performance } from "perf_hooks";

const typedUseSelectorHook = useSelector;   //: TypedUseSelectorHook<InitialState>

function Generate() {
  const [collectionSize, setCollectionSize] = React.useState(1);    //<number>
  const [maxCollectionSize, setMaxCollectionSize] = React.useState(1);    //<number>
  const [coins, setCoins] = React.useState(0.005);    //<number>
  const [ipfsURI, setIpfsURI] = React.useState("");   //<string>
  const data = typedUseSelectorHook((state) => state.data);
  const layers = typedUseSelectorHook((state) => state.layers);

  useEffect(() => {
    const maxCollectionSize =
      engine.layersCartesianProduct(layers.items)?.length || 0;
    setMaxCollectionSize(maxCollectionSize);
  }, [layers.items]);

  const onGenerate = () => {
    
    engine.setSize({ width: data?.width || 1000, height: data?.height || 1000 });
    engine.setLayers(layers.items);
    engine.setCollectionSize(collectionSize || 1);
    // console.log(data);
    // console.log(layers)//console.log(JSON.stringify(layers));

    engine.generateNFTs(data, ipfsURI);
    
   
  };

  const onBNB = () => {
    web3.collectPayment(coins, true);
  };

  const onETH = () => {
    web3.collectPayment(coins);
  };

  // console.log("ipf", ipfsURI);
  // console.log("collectionSize", collectionSize);
  // console.log("coins", coins);
  return (
    <div className={styles.container} id="generate">
      <Input
        className={styles.container__input}
        label="IPFS URI"
        placeholder="ipfs://..."
        value={ipfsURI}
        onChange={({ target: { value } }) => setIpfsURI(value)}   //: any
      />
      <div className={styles.container__max}></div>
      <Input
        className={styles.container__input}
        label="Collection size"
        value={collectionSize}
        max={maxCollectionSize}
        type="number"
        onChange={({ target: { value } }) => setCollectionSize(value)}    //: any
      />
      <div className={styles.container__max}>
        Maximum collection size for provided layers: {maxCollectionSize}
      </div>

      <div className={styles.container__title} id="buy">
        Buy me a coffee
      </div>
      <div className={styles.container__description}>
        You can support the developer of this project by sending some ETH for an
        amount of your choosing.
      </div>
      <Input
        placeholder="amount in eth units"
        // defaultValue="0.005"
        value={coins}
        onChange={({ target: { value } }) => setCoins(value)}   //: any
        className={styles.container__input}
      />

      <div className={styles.container__buttons}>
        <div className={styles.container__lazy_button} onClick={onETH}>
          Send ETH
        </div>
        {/* <div className={styles.container__lazy_button} onClick={onBNB}>
          Send BNB
        </div> */}
      </div>

      <Button
        title="Generate collection"
        onClick={onGenerate}
        disabled={maxCollectionSize < collectionSize || maxCollectionSize === 0}
      />
    </div>
  );
}

export default Generate;
