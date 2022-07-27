import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import PopUpDialog from 'src/components/PopUpDialog'
import Layout from 'src/components/Layout'
import ProfileService from 'src/services/ProfileService'
import IProfileData from 'src/types/Profile'

export default function DisplayProfile() {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	const [show, showDialog] = useState(false)
	const [profile, setProfile] = useState(null)
	const [profiles, setContent] = useState<IProfileData[]>()
	const router = useRouter()

	// Close the dialog
	const closeDialog = () => {
		showDialog(false)
	}
	// Executed when the user wants to delete the profile.
	const confirmDelete = async () => {
		// First, close the dialog
		showDialog(false)
		// Call the service to delete the profile.
		await ProfileService.exclude(profile)
		// At the end, reload the profiles pages
		router.reload()
	}

	// Fetch content from protected route
	useEffect(() => {
		const fetchData = async () => {
			const res = await ProfileService.listAll()
			if (res.data) {
				setContent(res.data)
			}
			if (!res.data || res.data.length == 0) {
				router.push('/profile?isNew=true')
			}
		}
		fetchData()
	}, [session])

	// When rendering client side don't display anything until loading is complete
	if (typeof window !== 'undefined' && loading) return null

	return (
		<Layout>
			{profiles && (
				<div className="overflow-x-auto relative shadow-md sm:rounded-l w-full max-w-5xl mx-auto p-5 mt-2">
					<div className="flex items-center justify-between ">
						<caption className="p-5 text-lg font-semibold text-left text-white bg-gray-800 rounded-tr-md rounded-tl-md mb-3 grid-cols-3">
							<div className="col-span-1">Lista dos Perfis</div>
							<div className="flex col-span-2">
								<p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
									Lista dos perfis do usuário logado no sistema. Lembrando que
									um usuário pode ter mais de um PERFIL. Através desta listagem,
									podemos editar, excluir ou criar um novo usuário através do
									botão ao lado.
								</p>
								<Link href="/profile?isNew=true">
									<button
										type="button"
										className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
									>
										NOVO
									</button>
								</Link>
							</div>
						</caption>
					</div>
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="py-3 px-6">
									E-mail
								</th>
								<th scope="col" className="py-3 px-6">
									Celular
								</th>
								<th scope="col" className="py-3 px-6">
									Perfil
								</th>
								<th scope="col" className="py-3 px-6">
									Bio
								</th>
								<th scope="col" className="py-3 px-6">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{profiles?.map((profile) => (
								<tr
									key={profile.id}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
								>
									<th
										scope="row"
										className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										{profile.email}
									</th>
									<td className="py-4 px-6">{profile.phone}</td>
									<td className="py-4 px-6">{profile.role}</td>
									<td className="py-4 px-6">{profile.bio}</td>
									<td className="py-4 px-6 text-right grid grid-cols-2">
										<Link href={`/profile?id=${profile.id}`}>
											<a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
												Edit
											</a>
										</Link>

										{/** onClick={(e) => handleDeleteClick(profile)} */}
										<button
											className="font-medium text-red-600 dark:text-red-500 hover:underline"
											data-bs-toggle="modal"
											data-bs-target="#exampleModalCenter"
											onClick={() => {
												showDialog(true)
												setProfile(profile)
											}}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<PopUpDialog
				show={show}
				close={closeDialog}
				confirm={confirmDelete}
				title={'Excluir Perfil'}
				description={
					'Tem certeza que seja excluir esse perfil? Um vez excluído, não será mais possível reverter essa operação!'
				}
			></PopUpDialog>
		</Layout>
	)
}
