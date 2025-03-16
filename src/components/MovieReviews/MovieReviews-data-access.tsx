"use client";

import {
  getMovieReviewsProgram,
  getMovieReviewsProgramId,
} from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

interface CreateEntryArgs {
  title: string;
  description: string;
  rating: number;
  image?: string;
  owner: PublicKey;
}

export function useMovieReviewsProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getMovieReviewsProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getMovieReviewsProgram(provider, programId),
    [provider, programId]
  );

  const accounts = useQuery({
    queryKey: ["MovieReviews", "all", { cluster }],
    queryFn: () => program.account.movieAccountState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const addMovieReview = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["MovieReviews", "addMovieReview", { cluster }],
    mutationFn: ({ title, description, rating, image }) => {
      return program.methods
        .addMovieReview(
          title,
          description,
          rating,
          image || "6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV"
        )
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: (error, variables) => {
      let title = variables?.title || "Unknown";
      console.log("title: " + title);
      if (error.message.includes("custom program error: 0x0")) {
        toast.error(
          `The review for the movie ${title} esto es has already been added`
        );
      } else {
        toast.error(`Failed to initialize account: ${error.message}`);
      }
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    addMovieReview,
  };
}

export function useMovieReviewsProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useMovieReviewsProgram();

  const accountQuery = useQuery({
    queryKey: ["MovieReviews", "fetch", { cluster, account }],
    queryFn: () => program.account.movieAccountState.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ["MovieReviews", "close", { cluster, account }],
    mutationFn: (title: string) =>
      program.methods.deleteMovieReview(title).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const updateMovieReview = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ["MovieReviews", "updateMovieReview", { cluster, account }],
    mutationFn: ({ title, description, rating }) =>
      program.methods.updateMovieReview(title, description, rating).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    updateMovieReview,
  };
}
