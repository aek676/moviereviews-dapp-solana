import { createGenericFile } from "@metaplex-foundation/umi";
import umiWithCurrentWalletAdapter from "./umiWithCurrentWalletAdapter";
import { createIrysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umiUploadFile = async (file: File) => {
  try {
    const umi = umiWithCurrentWalletAdapter();

    const fileBuffer = await file.arrayBuffer();
    const fileUmi = createGenericFile(new Uint8Array(fileBuffer), file.name, {
      contentType: file.type,
    });
    console.log(`Umi: ${umi.payer.publicKey}`);

    const uploader = createIrysUploader(umi, {
      payer: umi.payer,
      priceMultiplier: 100,
    });

    console.log(`FileUmi: ${fileUmi.fileName}`);

    const [uri] = await uploader.upload([fileUmi], {
      onProgress: (progress) => {
        console.log(`[Progreso]: ${(progress * 100).toFixed(2)}% subido`);
      },
    });

    console.log("Subido a:", uri);
    return uri;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
  }
};

export default umiUploadFile;

// https://devnet.irys.xyz/6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV
// https://gateway.irys.xyz/7v74NDcersrguRKrgSNQatGf47hHHhD1QbEbQsPjzQjP
