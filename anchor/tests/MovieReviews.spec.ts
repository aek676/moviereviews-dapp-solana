import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {MovieReviews} from '../target/types/MovieReviews'

describe('MovieReviews', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.MovieReviews as Program<MovieReviews>

  const MovieReviewsKeypair = Keypair.generate()

  it('Initialize MovieReviews', async () => {
    await program.methods
      .initialize()
      .accounts({
        MovieReviews: MovieReviewsKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([MovieReviewsKeypair])
      .rpc()

    const currentCount = await program.account.MovieReviews.fetch(MovieReviewsKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment MovieReviews', async () => {
    await program.methods.increment().accounts({ MovieReviews: MovieReviewsKeypair.publicKey }).rpc()

    const currentCount = await program.account.MovieReviews.fetch(MovieReviewsKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment MovieReviews Again', async () => {
    await program.methods.increment().accounts({ MovieReviews: MovieReviewsKeypair.publicKey }).rpc()

    const currentCount = await program.account.MovieReviews.fetch(MovieReviewsKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement MovieReviews', async () => {
    await program.methods.decrement().accounts({ MovieReviews: MovieReviewsKeypair.publicKey }).rpc()

    const currentCount = await program.account.MovieReviews.fetch(MovieReviewsKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set MovieReviews value', async () => {
    await program.methods.set(42).accounts({ MovieReviews: MovieReviewsKeypair.publicKey }).rpc()

    const currentCount = await program.account.MovieReviews.fetch(MovieReviewsKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the MovieReviews account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        MovieReviews: MovieReviewsKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.MovieReviews.fetchNullable(MovieReviewsKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
