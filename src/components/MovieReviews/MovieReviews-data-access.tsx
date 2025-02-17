'use client'

import { getMovieReviewsProgram, getMovieReviewsProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useMovieReviewsProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getMovieReviewsProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getMovieReviewsProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['MovieReviews', 'all', { cluster }],
    queryFn: () => program.account.MovieReviews.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['MovieReviews', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ MovieReviews: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useMovieReviewsProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useMovieReviewsProgram()

  const accountQuery = useQuery({
    queryKey: ['MovieReviews', 'fetch', { cluster, account }],
    queryFn: () => program.account.MovieReviews.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['MovieReviews', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ MovieReviews: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['MovieReviews', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ MovieReviews: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['MovieReviews', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ MovieReviews: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['MovieReviews', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ MovieReviews: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
