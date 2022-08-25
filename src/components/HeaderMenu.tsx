import { signIn, signOut, useSession } from 'next-auth/react'
import { MegaMenu } from 'primereact/megamenu'
import { Avatar } from 'primereact/avatar'
import Router from 'next/router'

export default function HeaderMenu() {
	const { data: session, status } = useSession()
	const loading = status === 'loading'

	if (loading) return null

	const items = [
		{
			label: 'Dashboard',
			icon: 'pi pi-fw pi-desktop',
			disabled: true
		},
		{
			label: 'Usuário',
			icon: 'pi pi-fw pi-users',
			items: [
				[
					{
						label: 'Perfil',
						items: [
							{
								label: 'Listar',
								icon: 'pi pi-fw pi-list',
								command: (e) => {
									Router.push('/profile/list')
								}
							}
						]
					},
					{
						label: 'Conta',
						items: [
							{
								label: 'Entrar',
								icon: 'pi pi-fw pi-sign-in',
								disabled: session ? true : false,
								command: (e) => {
									signIn('github')
								}
							},
							{
								label: 'Sair',
								icon: 'pi pi-fw pi-sign-out',
								disabled: session ? false : true,
								command: (e) => {
									signOut()
								}
							}
						]
					}
				]
			]
		},
		{
			label: 'Configurações',
			icon: 'pi pi-fw pi-cog',
			items: [
				[
					{
						label: 'Cagetoria',
						items: [
							{
								label: 'Listar',
								icon: 'pi pi-fw pi-list',
								command: (e) => {
									Router.push('/category')
								}
							}
						]
					},
					{
						label: 'Ações',
						items: [
							{
								label: 'Listar',
								icon: 'pi pi-fw pi-list',
								command: (e) => {
									Router.push('/stock')
								}
							},
							{
								label: 'Negociações',
								command: (e) => {
									Router.push('/negotiations')
								},
								icon: 'pi pi-fw pi-cloud-upload'
							}
						]
					},
					{
						label: 'Contas a Pagar',
						items: [{ label: 'Lançamento', icon: 'pi pi-fw pi-wallet' }]
					}
				]
			]
		}
	]

	const start = (
		<img
			alt="logo"
			src="showcase/images/logo.png"
			onError={(e) =>
				(e.target.src =
					'https://expenses-image-storage.s3.amazonaws.com/logo/financial.png')
			}
			className="mr-2 h-10"
		></img>
	)

	const end = (
		<div className="flex items-center">
			<div className="pr-9">
				<button
					type="button"
					className="bg-zinc-900 p-1  text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
				>
					<span className="sr-only">View notifications</span>
					<i className="pi pi-bell" style={{ fontSize: '1.5em' }}></i>
				</button>
			</div>
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
	)

	return (
		<div>
			<div className="">
				<MegaMenu
					model={items}
					orientation="horizontal"
					start={start}
					end={end}
				/>
			</div>
		</div>
	)
}
