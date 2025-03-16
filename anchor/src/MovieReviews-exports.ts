// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import MovieReviewsIDL from "../target/idl/movie_reviews.json";
import type { MovieReviews } from "../target/types/movie_reviews";

// Re-export the generated IDL and type
export { MovieReviews, MovieReviewsIDL };

// The programId is imported from the program IDL.
export const MOVIE_REVIEWS_PROGRAM_ID = new PublicKey(MovieReviewsIDL.address);

// This is a helper function to get the MovieReviews Anchor program.
export function getMovieReviewsProgram(
  provider: AnchorProvider,
  address?: PublicKey
) {
  return new Program(
    {
      ...MovieReviewsIDL,
      address: address ? address.toBase58() : MovieReviewsIDL.address,
    } as MovieReviews,
    provider
  );
}

// This is a helper function to get the program ID for the MovieReviews program depending on the cluster.
export function getMovieReviewsProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the MovieReviews program on devnet and testnet.
      return new PublicKey("uSWfcG2A6oC2UcWcX1wamipAbu2BXY3yf3WBGJ7mBAY");
    case "mainnet-beta":
    default:
      return MOVIE_REVIEWS_PROGRAM_ID;
  }
}
