import { signIn, signOut, useSession } from 'next-auth/react'
import { Fragment } from 'react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Avatar } from 'primereact/avatar'
import Link from 'next/link'

const navigation = [
	{ name: 'Dashboard', href: '/', current: true },
	{ name: 'Perfis', href: '/profile/display', current: false },
	{ name: 'Categorias', href: '/category', current: false },
	{ name: 'Calendar', href: '#', current: false }
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

/**
 * <p>
 * Set the current selected navigation item
 * @param current Current selected navigation item
 */
const onItemClick = async (current) => {
	navigation.map((item) => {
		item.current = item.name === current.name
	})
}

export default function Header() {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	if (loading) return null

	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => (
				<>
					<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
						<div className="relative flex items-center justify-between h-16">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<MenuIcon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex-shrink-0 flex items-center">
									<img
										className="block lg:hidden h-8 w-auto"
										src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
										alt="Workflow"
									/>
									<img
										className="hidden lg:block h-8 w-auto"
										src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
										alt="Workflow"
									/>
								</div>
								<div className="hidden sm:block sm:ml-6">
									<div className="flex space-x-4">
										{navigation.map((item) => (
											<Link key={item.name} href={item.href}>
												<a
													onClick={(e) => onItemClick(item)}
													className={classNames(
														item.current
															? 'bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'px-3 py-2 rounded-md text-sm font-medium'
													)}
													aria-current={item.current ? 'page' : undefined}
												>
													{item.name}
												</a>
											</Link>
										))}
									</div>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								<button
									type="button"
									className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
								>
									<span className="sr-only">View notifications</span>
									<i className="pi pi-bell" style={{ fontSize: '1.5em' }}></i>
								</button>

								{/* Profile dropdown */}
								<Menu as="div" className="ml-3 relative z-40">
									<div>
										<Menu.Button className="bg-gray-800 flex text-sm rounded-full">
											{/* Logged in */}
											{session && (
												<div className="flex items-center">
													<Avatar
														image={session?.user?.image}
														className="mr-2"
														size="large"
														shape="circle"
													/>
													<div className="font-medium dark:text-white">
														<div className="text-xs text-indigo-400 hover:text-slate-500 text-left">
															{session?.user?.name}
														</div>
														<div className="text-sm text-slate-50 hover:text-slate-500">
															{session?.user?.email}
														</div>
													</div>
												</div>
											)}
											{/* NOT Logged in */}
											{!session && (
												<span className="flex items-center">
													<div className="relative w-10 h-10 overflow-hidden bg-gray-500 rounded-full dark:bg-gray-600">
														<svg
															className="absolute w-12 h-12 text-gray-400 -left-1"
															fill="currentColor"
															viewBox="0 0 20 20"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																fillRule="evenodd"
																d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
																clipRule="evenodd"
															/>
														</svg>
													</div>

													<span className="ml-3 block truncate text-slate-50 hover:text-slate-500">
														Click Para Entrar
													</span>
												</span>
											)}
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
											<Menu.Item>
												{({ active }) => (
													<div
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
														)}
													>
														<Link href="/profile/display">
															<a>Profiles</a>
														</Link>
													</div>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a
														href="#"
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700'
														)}
													>
														Settings
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<div
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block text-sm text-gray-700'
														)}
													>
														{session && (
															<button
																onClick={() => signOut()}
																className={classNames(
																	active ? 'bg-gray-100' : '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																Sign out
															</button>
														)}
														{!session && (
															<button
																onClick={() => signIn('github')}
																className={classNames(
																	active ? 'bg-gray-100' : '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}
															>
																Sign In
															</button>
														)}
													</div>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block px-3 py-2 rounded-md text-base font-medium'
									)}
									aria-current={item.current ? 'page' : undefined}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}
