// Ejemplo: UploadFileComponent.tsx
"use client";
import React, { useState } from "react";
import umiUploadFile from "@/components/umi/lib/umiUploadFile"; // Ajusta la ruta según tu estructura

const UploadFileComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Por favor, selecciona un archivo primero.");
      return;
    }
    try {
      setIsLoading(true);
      setMessage("Subiendo archivo...");

      // Llamamos a tu método umiUploadFile, pasándole el File del input
      const uri = await umiUploadFile(selectedFile);

      setIsLoading(false);
      setMessage("¡Archivo subido con éxito!");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setIsLoading(false);
      setMessage("Error al subir el archivo.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Subir archivo a Irys</h2>

      <input
        type="file"
        accept="*"
        onChange={handleFileChange}
        style={{ display: "block", marginBottom: "1rem" }}
      />

      <button onClick={handleUpload}>
        {isLoading ? "Subiendo..." : "Subir"}
      </button>

      {message && (
        <p style={{ marginTop: "1rem", color: isLoading ? "blue" : "green" }}>
          {message}
        </p>
      )}

      <img
        src="https://devnet.irys.xyz/6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV"
        alt="imagen"
      />

      <embed
        src="https://devnet.irys.xyz/AUqtkymhNtst5A1wP4FzaWZ7mJiMqY7djBzPHQvY2A4W"
        width="800px"
        height="600px"
        type="application/pdf"
      />
    </div>
  );
};

export default UploadFileComponent;
