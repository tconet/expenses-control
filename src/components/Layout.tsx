import Seo from 'src/components/Soe'
import Header from 'src/components/Header'

interface Props {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<>
			<Seo></Seo>
			<Header />
			<main>{children}</main>
		</>
	)
}
