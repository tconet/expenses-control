import Layout from 'src/components/Layout'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ExclamationIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { Role as PrismaRole } from '@prisma/client'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Profile() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	// The selected profile
	const [_, setSelectedProfile] = useState<string>()
	const router = useRouter()

	// Call the API to create the profile
	const onSubmitForm = async (values) => {
		console.log('Profile.tsx: ', values)

		const res = await axios.post('/api/createprofile', values)
		if (res.status === 200) {
			router.push('/')
		}
	}

	// This function will be triggered when a profile radio button is selected
	const radioProfileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedProfile(event.target.value)
	}

	return (
		<Layout>
			<div>
				<div className="md:grid md:grid-cols-3 md:gap-6 bg-gray-300">
					<div className="md:col-span-1">
						<div className="px-4 sm:px-0">
							<h3 className="text-4xl py-3 px-2 font-bold leading-6 text-indigo-600">
								Profile
							</h3>
							<p className="mt-1 px-2 text-sm text-gray-600">
								Através desta funcionalidade é possível alterar algumas
								informações em relação ao seu perfil. Aproveita para fazer uma
								descrição mais detalhada de suas características.
							</p>
						</div>
					</div>
					<div className="mt-5 md:mt-0 md:col-span-2">
						<form onSubmit={handleSubmit(onSubmitForm)}>
							<div className="shadow sm:rounded-md sm:overflow-hidden">
								<div className="px-4 py-5 bg-white space-y-6 sm:p-6">
									{/* E-MAIL e CELULAR */}
									<div className="grid grid-cols-6 gap-6">
										{/* E-MAIL */}
										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="profile-email"
												className="block text-sm font-medium text-gray-700"
											>
												E-mail
												{errors?.email && (
													<span className="ml-1 text-red-500 required-dot">
														*
													</span>
												)}
											</label>
											<div className="mt-1 flex rounded-md shadow-sm relative">
												<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
													<svg
														width={15}
														height={15}
														fill="currentColor"
														viewBox="0 0 1792 1792"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
													</svg>
												</span>
												<input
													type="text"
													name="profile-email"
													id="profile-email"
													className={classNames(
														errors?.email
															? 'ring-red-500 ring-2 focus:ring-red-500 focus:border-red-500'
															: 'focus:ring-indigo-500 focus:border-indigo-500',
														'flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300'
													)}
													placeholder="meuemail@gmail.com"
													{...register('email', {
														required: 'Email Inválido',
														pattern: {
															value:
																/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
															message: 'Digite um endereço de e-mail válido'
														}
													})}
												/>
												{errors?.email && (
													<ExclamationIcon
														className="h-5 w-5 text-red-500 absolute right-2 bottom-2"
														aria-hidden="true"
													/>
												)}
											</div>
											{errors?.email && (
												<p className="mt-1 text-sm text-red-500 -bottom-6">
													{errors?.email.message}
												</p>
											)}
										</div>
										{/* CELULAR */}
										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700"
											>
												Celular
												{errors?.phone && (
													<span className="ml-1 text-red-500 required-dot">
														*
													</span>
												)}
											</label>
											<div className="flex rounded-md shadow-sm relative">
												<input
													type="text"
													name="phone"
													id="phone"
													autoComplete="family-name"
													className={classNames(
														errors?.phone
															? 'ring-red-500 ring-2 focus:ring-red-500 focus:border-red-500'
															: 'focus:ring-indigo-500 focus:border-indigo-500',
														'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
													)}
													{...register('phone', {
														required: 'Celular Obrigatório',
														pattern: {
															value: /\(\d{2}\) \d{5}\-\d{4}/,
															message: 'Fomarto Inválido Ex: (81) 9XXX-XXXX'
														}
													})}
												/>
												{errors?.phone && (
													<ExclamationIcon
														className="h-5 w-5 text-red-500 absolute right-2 bottom-2"
														aria-hidden="true"
													/>
												)}
											</div>
											{errors?.phone && (
												<p className="mt-1 text-sm text-red-500 -bottom-6">
													{errors?.phone.message}
												</p>
											)}
										</div>
									</div>
									{/* BIOGRAFIA */}
									<div>
										<label
											htmlFor="bio"
											className="block text-sm font-medium text-gray-700"
										>
											Biografia
										</label>
										<div className="mt-1">
											<textarea
												id="bio"
												name="bio"
												rows={3}
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
												placeholder="voce@example.com"
												defaultValue={''}
												{...register('bio', {
													required: false
												})}
											/>
										</div>
										<p className="mt-2 text-sm text-gray-500">
											Breve descrição do seu perfil. URLs são hyperlinked
										</p>
									</div>
									{/* PERFIL */}
									<div>
										<fieldset>
											<legend className="contents text-base font-medium text-gray-900">
												Permissões do Perfil
											</legend>
											<p className="text-sm text-gray-500">
												Abaixo estão as permissões disponíveis para o Perfil
											</p>
											<div className="mt-4 space-y-4">
												<div className="flex items-center">
													<input
														id="profile-admin"
														name="role"
														type="radio"
														value={PrismaRole.ADMIN}
														className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
														{...register('role', {
															required: false
														})}
														onChange={radioProfileHandler}
													/>
													<label
														htmlFor="profile-admin"
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														Adminstrador
													</label>
												</div>
												<div className="flex items-center">
													<input
														id="profile-user"
														name="role"
														type="radio"
														value={PrismaRole.USER}
														className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
														{...register('role', {
															required: false
														})}
														onChange={radioProfileHandler}
													/>
													<label
														htmlFor="profile-user"
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														Usuário Geral
													</label>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
								<div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
									<button
										type="submit"
										className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Save
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
