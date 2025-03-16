import { createGenericFile } from "@metaplex-foundation/umi";
import umiWithCurrentWalletAdapter from "./umiWithCurrentWalletAdapter";
import { createIrysUploader } from "@metaplex-foundation/umi-uploader-irys";

export const umiUploadFile = async (file: File) => {
  try {
    const umi = umiWithCurrentWalletAdapter();

    const fileBuffer = await file.arrayBuffer();
    const fileUmi = createGenericFile(new Uint8Array(fileBuffer), file.name, {
      contentType: file.type,
    });
    console.log(`Umi: ${umi.payer.publicKey}`);

    const uploader = createIrysUploader(umi, {
      payer: umi.payer,
    });

    console.log(`FileUmi: ${fileUmi.fileName}`);

    let [uri] = await uploader.upload([fileUmi], {
      onProgress: (progress) => {
        console.log(`[Progreso]: ${(progress * 100).toFixed(2)}% subido`);
      },
    });

    uri = uri
      .replace("https://devnet.irys.xyz/", "")
      .replace("https://gateway.irys.xyz/", "");

    return uri;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
  }
};

export async function uploadUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const blob = await response.blob();
    const file = new File([blob], "URL file", { type: blob.type });

    const umiUri = await umiUploadFile(file);
    console.log("Subido a:", umiUri);
    return umiUri;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
}

// https://devnet.irys.xyz/6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV
// https://gateway.irys.xyz/7v74NDcersrguRKrgSNQatGf47hHHhD1QbEbQsPjzQjP
