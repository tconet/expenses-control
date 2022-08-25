import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CategoryService from 'src/services/CetegoryService'
import ICategoryData from 'src/types/Category'
import Layout from 'src/components/Layout'
import PopUpDialog from 'src/components/PopUpDialog'
import Link from 'next/link'

export default function DisplayCategory() {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	const [show, showDialog] = useState(false)
	const [category, setCategory] = useState(null)
	const [categories, setContent] = useState<ICategoryData[]>()
	const router = useRouter()

	// Close the dialog
	const closeDialog = () => {
		showDialog(false)
	}

	// Executed when the user wants to delete the category.
	const confirmDelete = async () => {
		// First, close the dialog
		showDialog(false)
		// Call the service to delete the category.
		await CategoryService.exclude(category)
		// At the end, reload the categories pages
		router.reload()
	}

	// Fetch content from protected route
	useEffect(() => {
		const fetchData = async () => {
			const res = await CategoryService.listAll()
			if (res.data) {
				setContent(res.data)
			}
			if (!res.data || res.data.length == 0) {
				router.push('/category?isNew=true')
			}
		}
		fetchData()
	}, [session])

	// When rendering client side don't display anything until loading is complete
	if (typeof window !== 'undefined' && loading) return null

	return (
		<Layout>
			{categories && (
				<div className="overflow-x-auto relative shadow-md sm:rounded-l w-2/3 max-w-2xl mx-auto p-5 mt-2">
					<div className="flex items-center justify-between ">
						<caption className="p-5 text-lg font-semibold text-left text-white bg-gray-800 rounded-tr-md rounded-tl-md mb-3 grid-cols-3">
							<div className="col-span-1">Lista das Categorias</div>
							<div className="flex col-span-2">
								<p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
									Lista das categories disponíveis no sistema. Através desta
									listagem, podemos editar, excluir ou criar uma nova categoria
									clicando no botão ao lado.
								</p>
								<Link href="/category?isNew=true">
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
									Image
								</th>
								<th scope="col" className="py-3 px-6">
									Name
								</th>
								<th scope="col" className="py-3 px-6">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody>
							{categories?.map((category) => (
								<tr
									key={category.id}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
								>
									<th
										scope="row"
										className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
									>
										<img
											className="w-10 h-10 rounded-full"
											src={category.image}
										></img>
									</th>
									<td className="py-4 px-6">{category.name}</td>
									<td className="py-4 px-6 text-right">
										<div className="grid grid-cols-4 items-center gap-1">
											<Link href={`/category?id=${category.id}`}>
												<a className="col-start-3 font-medium text-blue-600 dark:text-blue-500 hover:underline">
													Edit
												</a>
											</Link>
											<button
												className="col-start-4 font-medium text-red-600 dark:text-red-500 hover:underline"
												data-bs-toggle="modal"
												data-bs-target="#exampleModalCenter"
												onClick={() => {
													showDialog(true)
													setCategory(category)
												}}
											>
												Delete
											</button>
										</div>
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
				title={'Excluir Categoria'}
				description={
					'Tem certeza que seja excluir essa categoria? Um vez excluída, não será mais possível reverter essa operação!'
				}
			></PopUpDialog>
		</Layout>
	)
}
