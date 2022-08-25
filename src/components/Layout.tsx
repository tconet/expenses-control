import Seo from 'src/components/Soe'
import Header from 'src/components/Header'
import HeaderMenu from './HeaderMenu'

interface Props {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<>
			<Seo></Seo>
			<HeaderMenu />
			<main>{children}</main>
		</>
	)
}
