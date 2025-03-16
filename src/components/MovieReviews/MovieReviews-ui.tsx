"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useMovieReviewsProgram,
  useMovieReviewsProgramAccount,
} from "./MovieReviews-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { getMoviePoster } from "@/lib/utils";
import { uploadUrl } from "../umi/lib/umiUploadFile";

export function MovieReviewsCreate() {
  const { addMovieReview } = useMovieReviewsProgram();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  const isFormValid =
    title.trim() !== "" && description.trim() !== "" && rating > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const getPoster = await getMoviePoster(title);
    const uri = await uploadUrl(getPoster);

    if (publicKey && isFormValid) {
      addMovieReview.mutateAsync({
        title,
        description,
        rating,
        owner: publicKey,
        image: uri,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="space-y-4">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="description" className="space-y-4">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block font-medium">
          Calificación (1-5)
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          required
          className="input input-bordered w-fit"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={addMovieReview.isPending || !isFormValid}
      >
        {addMovieReview.isPending ? "Creando..." : "Crear reseña"}
      </button>
    </form>
  );
}

export function MovieReviewsList() {
  const { accounts, getProgramAccount } = useMovieReviewsProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <MovieReviewsCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function MovieReviewsCard({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();

  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newRating, setNewRating] = useState(0);

  const { accountQuery, updateMovieReview, closeMutation } =
    useMovieReviewsProgramAccount({
      account,
    });

  const title = useMemo(
    () => accountQuery.data?.title ?? "No title",
    [accountQuery.data?.title]
  );

  const description = useMemo(() => {
    let aux = accountQuery.data?.description ?? "No description";
    setNewDescription(aux);
    return aux;
  }, [accountQuery.data?.description]);

  const rating = useMemo(() => {
    let aux = accountQuery.data?.rating ?? 0;
    setNewRating(aux);
    return aux;
  }, [accountQuery.data?.rating]);

  const image = useMemo(
    () => accountQuery.data?.image ?? "No image",
    [accountQuery.data?.image]
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDescription !== description || newRating !== rating) {
      if (publicKey) {
        updateMovieReview.mutateAsync({
          title,
          description: newDescription,
          rating: Number(newRating),
          owner: publicKey,
        });
        setIsEditing(false);
      }
    }
  };

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <div className="w-full h-[300px] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              className="w-full h-full object-contain object-center"
              src={`https://devnet.irys.xyz/${image}`}
              alt={title}
            />
          </div>

          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {title}
          </h2>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 w-full">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-base-200 text-neutral-content"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="rating" className="block text-sm font-medium">
                  Rating
                </label>
                <input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-base-200 text-neutral-content"
                />
              </div>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMovieReview.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {updateMovieReview.isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="card-actions justify-around">
                <p>Description: {description}</p>
              </div>
              <div>
                <p>Rating: {rating}</p>
              </div>
              <button
                className="btn btn-xs btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </>
          )}
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to close this account?"
                  )
                ) {
                  return;
                }
                return closeMutation.mutateAsync(title);
              }}
              disabled={closeMutation.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
