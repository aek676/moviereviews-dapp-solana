// Ejemplo: UploadFileComponent.tsx
"use client";
import React, { useState } from "react";
import { umiUploadFile, uploadUrl } from "@/components/umi/lib/umiUploadFile"; // Ajusta la ruta según tu estructura
import { getMoviePoster } from "@/lib/utils";

const UploadFileComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [movieTitle, setMovieTitle] = useState<string>("");
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterUri, setPosterUri] = useState<string | null>(null);
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
      console.log("Subido a:", uri);

      setIsLoading(false);
      setMessage("¡Archivo subido con éxito!");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setIsLoading(false);
      setMessage("Error al subir el archivo.");
    }
  };

  const handlePoster = async () => {
    try {
      const posterUrl = await getMoviePoster(movieTitle);
      console.log("Poster URL:", posterUrl);
      setPosterUrl(posterUrl);
    } catch (error) {
      console.error("Error al obtener el poster:", error);
    }
  };

  const handleUmiUpload = async () => {
    try {
      if (!posterUrl) {
        console.error("No hay poster para subir");
        return;
      }
      const uri = await uploadUrl(posterUrl);
      setPosterUri(uri || "Error al subir el poster");
    } catch (error) {
      console.error("Error al subir el archivo a Umi:", error);
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

      {/* <img
        src="https://devnet.irys.xyz/6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV"
        alt="imagen"
      /> */}

      {/* <embed
        src="https://devnet.irys.xyz/AUqtkymhNtst5A1wP4FzaWZ7mJiMqY7djBzPHQvY2A4W"
        width="800px"
        height="600px"
        type="application/pdf"
      /> */}

      <h2>Buscar poster de película</h2>
      <input
        type="text"
        value={movieTitle}
        onChange={(e) => setMovieTitle(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handlePoster}>Buscar poster</button>

      {posterUrl && (
        // PosterUrl existe
        <>
          <img
            src={posterUrl}
            alt="Movie Poster"
            style={{
              maxWidth: "100%",
              marginTop: "1rem",
            }}
          />

          <button onClick={handleUmiUpload}>Subir a Umi</button>
        </>
      )}

      {posterUri && <p style={{ marginTop: "1rem" }}>Subido a: {posterUri}</p>}
    </div>
  );
};

export default UploadFileComponent;
