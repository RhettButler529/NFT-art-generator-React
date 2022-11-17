import { createCanvas, loadImage } from "canvas";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Buffer } from "buffer";
// import metadata from "../constants/metadata.json";
// import { iData } from "../redux/types/initialStates";

// export type Size = {
//   width: number;
//   height: number;
// };

// export type Image = {
//   layer?: string;
//   name: string;
//   path: string;
//   rarity: number;
// };

// export type Layer = {
//   position: number;
//   name: string;
//   images: Array<Image>;
// };

class Engine {
  // layers: Array<Layer>;
  // size: Size;
  // ctx: any;
  // collectionSize: number;
  // canvas: any;
  // preview: string;
  // jszip: any;

  constructor(size, layers, collectionSize) { //: Size : Array<Layer> : number
    this.size = size;
    this.layers = layers;
    this.collectionSize = collectionSize;
    this.preview = "";
    this.jszip = new JSZip();

    this.canvas = createCanvas(size.width, size.height);
    this.ctx = this.canvas.getContext("2d");
  }

  isValid(){  //: boolean 
    return (
      this.layers.length > 0 &&
      this.layers.every((layer) => layer.images.length > 0)
    );
  }

  setSize(size) {   //: Size
    this.size = size;
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  setLayers(layers) {   //: Array<Layer>
    this.layers = layers;
  }

  setCollectionSize(collectionSize) {   //: number
    this.collectionSize = collectionSize;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.size.width, this.size.height);
  }

  async drawImage(imagePath, x, y) {    //: string ?: number ?: number
    const image = await loadImage(imagePath);
    
    this.ctx.drawImage(image, x || 0, y || 0);
    // console.log("ctx",this.ctx);
  }


  
  async generateNFTPreview(images) {    //: Array<Image>
    const imgs = Array.isArray(images) ? images : [images];
    this.clearCanvas();

    for (let img of imgs){
      await this.drawImage(img.path);
    }
    return;
    // const drawing = imgs?.map(async ({ path }) => {
    //   return this.drawImage(path, 0, 0);
    // });
    //console.log(drawing);
    // await Promise.all(drawing);
    /// for (let promise of drawing){
    ///   await promise;
    ///   console.log("preview", this.preview);
    /// }
  }

  async generateNFT(images, fileName) {   //: Array<Image>    : string
    const imgs = Array.isArray(images) ? images : [images];
    // this.clearCanvas();
    for (let img of imgs){
      // console.log(img);
      await this.drawImage(img.path);
    }
   
    // const drawing = imgs.map(async ({ path }) => {
    //   return this.drawImage(path);
    // });
    // await Promise.all(drawing);
    await this.saveFileToZip(`${fileName}.png`, "Collection"
  //     ,{
  //     compression: "STORE"
  // }
    
    );
    // await this.saveCanvasFile(`${fileName}.png`);
  }

  async saveFileToZip(fileName, path) {   //: string  : string
    // var imageData =  await this.ctx.getImageData(0,0,1000,1000);
    // var buffer = await imageData.data.buffer;
    // console.log(buffer);
    // await this.jszip.file(`NFTCollection/${path}/${fileName}`, buffer);
    // return;
    return await new Promise((resolve) => {
      this.canvas.toBlob((blob) => {    //: any
        this.jszip.file(`NFTCollection/${path}/${fileName}`, blob);
        this.clearCanvas();
        resolve(true);
      });
    });
    return await new Promise((resolve) => {
      this.canvas.toBlob((blob) => {    //: any
        this.jszip.file(`NFTCollection/${path}/${fileName}`, blob);
        this.clearCanvas();
        resolve(true);
      });
    });
  }

  async saveCanvasFile(fileName) {    //: string
    this.canvas.toBlob(async (blob) => {    //: any
      saveAs(blob, `${fileName}`);
    });
  }

  async generatePreview() {
    return await new Promise((resolve) => {
      this.canvas.toBlob(async (blob) => {    //: any
        const img = (await this.blobToBase64(blob));    // as string
        // console.log(img);
        this.preview = img;
        resolve(img);
      });
    });
  }

  blobToBase64(blob) {    //: any
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  layersCartesianProduct(layers) {   //: Array<Layer> : Array<Array<Image>>
    const images = layers
      .map((layer) => ({
        ...layer,
        images: layer.images.map((image) => ({ ...image, layer: layer.name })),
      }))
      .map((layer) => layer.images);
    return images.reduce((a, b) =>
      a.flatMap((d) => b.map((e) => [d, e].flat()))
    );
  }

  selectNRandomElements(
    array,    //: Array<Array<Image>>
    n   //: number
  ) {   //: Array<Array<Image>>
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  async generateBannerCollage(blobImage) {    //?: boolean
    if (!this.isValid()) return;

    this.jszip = new JSZip();
    const cartesianProduct = this.layersCartesianProduct(this.layers);
    const allImages = this.selectNRandomElements(
      cartesianProduct,
      cartesianProduct?.length > 50 ? 50 : cartesianProduct?.length
    );
    const gridSize = Math.ceil(Math.sqrt(allImages.length));

    this.canvas.width = this.size.width * gridSize;
    this.canvas.height = this.size.height * gridSize;

    let x = 0;
    let y = 0;
    for (let i = 0; i < allImages.length; i++) {
      for (let j = 0; j < allImages[i].length; j++) {
        await this.drawImage(allImages[i][j].path, x, y);
      }

      if (x >= this.size.width * gridSize) {
        x = 0;
        y += Number(this.size.height);
      } else {
        x += Number(this.size.width);
      }
    }

    return await new Promise((resolve) => {
      this.canvas.toBlob(async (blob) => {    //: any
        const img = (await this.blobToBase64(blob)) ;   //as string
        this.preview = img;
        // console.log(img);
        blobImage ? resolve(blob) : resolve(img);
      });
    });
  }

  async downloadBannerCollage() {
    if (!this.isValid()) return;

    this.jszip = new JSZip();

    const blobImage = await this.generateBannerCollage(true);
    await this.jszip.file(`NFTCollectionBanner/Banner/banner.png`, blobImage);

    this.jszip
      .generateAsync({ type: "blob" })
      .then((content) => {    //: any
        saveAs(content, "NFTCollectionBanner.zip");
      })
      .catch((err) => console.log(err));    //: any
  }

  async generateNFTs(data, ipfsURI) {   //: iData   : string
    
    this.jszip = new JSZip();
    const cartesianProduct = this.layersCartesianProduct(this.layers);
    const selectedImages = this.selectNRandomElements(
      cartesianProduct,
      this.collectionSize
    );
    ///TODO
    var startTime = new Date().getTime();
    console.log(startTime);

    let index = 0;
    for (let selectedImage of selectedImages){
      // console.log(selectedImage);
      // console.log(selectedImage[images]);
      
      await this.generateNFT(selectedImage, `${index}`);
      await this.generateMetaData(data, selectedImage, ipfsURI, index);
      index++;
    }

    // await Promise.all(
    //   selectedImages.map(async (images, index) => {
    //     console.log(images);
    //     await this.generateNFT(images, `${index}`);
    //     await this.generateMetaData(data, images, ipfsURI, index);
    //   })
    // );

    var endTime = new Date().getTime();
    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

    this.jszip
      .generateAsync({ type: "blob" })
      .then((content) => {    //: any
        saveAs(content, "NFTCollection.zip");
      })
      .catch((err) => console.log(err));    //: any

    
  }

  async generateMetaData(
    data,   //: iData
    images,   //: Image[]
    ipfsURI,    //: string
    index   //: number
  ) {

    const imgs = Array.isArray(images) ? images : [images];
    
    let dna = "";
    const attributes = imgs.map((image) => {
      const breakPoints = image.path.split(".");
      dna += breakPoints[breakPoints?.length - 2];
     // console.log("dna:", dna);
      return {
        trait_type: image.layer,
        value: image?.name?.split(".")[0],
      };
    });
    
    
    const metadata = {
      name: data.name,
      description: data.description,
      attributes: attributes,
      image: `ipfs://${ipfsURI.replace("ipfs://", "")}/${index}.png`,
      dna: Buffer.from(`${dna}`).toString("hex"),   
      edition: 1,
      date: data?.date,
      engine: "NFTooze",
    };
    

    await this.jszip.file(
      `NFTCollection/Collection/${index}.json`,
      JSON.stringify(metadata)
    );

    return metadata;
  }
}

const engine = new Engine({ width: 374, height: 374 }, [], 1);

export default engine;
