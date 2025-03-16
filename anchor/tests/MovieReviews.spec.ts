import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { MovieReviews } from "../target/types/movie_reviews";

describe("MovieReviews", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MovieReviews as Program<MovieReviews>;

  const movie = {
    title: "Just a test movie",
    description: "Wow what a good movie it was real great",
    rating: 5,
    image: "6gQbZWRnaKBVk9Dvrfvt3tgdvYxPMU49W32MUB4xVNLV",
  };

  const [movie_pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Movie review is added", async () => {
    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating, movie.image)
      .rpc();

    const account = await program.account.movieAccountState.fetch(movie_pda);
    expect(account.reviewer === provider.wallet.publicKey);
    expect(movie.title === account.title);
    expect(movie.description === account.description);
    expect(movie.rating === account.rating);
    expect(movie.image === account.image);

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });

  it("Movie review is updated`", async () => {
    const newDescription = "Wow this is new";
    const newRating = 4;

    const tx = await program.methods
      .updateMovieReview(movie.title, newDescription, newRating)
      .rpc();

    const account = await program.account.movieAccountState.fetch(movie_pda);
    expect(account.reviewer === provider.wallet.publicKey);
    expect(movie.title === account.title);
    expect(newRating === account.rating);
    expect(newDescription === account.description);
    expect(movie.image === account.image);

    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });

  it("All movie reviews", async () => {
    const accounts = await program.account.movieAccountState.all();
    console.log(accounts);
  });

  it("Deletes a movie review", async () => {
    const tx = await program.methods.deleteMovieReview(movie.title).rpc();

    const account = await program.account.movieAccountState.fetchNullable(
      movie_pda
    );
    console.log(account === null);
    console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });
});
