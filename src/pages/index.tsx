import React from 'react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Unlogged from 'src/components/Unlogged'
import Layout from 'src/components/Layout'

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	if (loading) return null

	return (
		<Layout>
			{!session && <Unlogged></Unlogged>}
			{session && <h1>Bem Vindo - {session?.user.name}</h1>}
		</Layout>
	)
}
export default Home
