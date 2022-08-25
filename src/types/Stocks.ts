export default interface IStockData {
	id?: string | null
	symbol: string
	company_name?: string
	document: string
	description: string
	stockType: string
	image?: String
}

export function createEmpty(): IStockData {
	return {
		id: null,
		symbol: '',
		company_name: '',
		document: '',
		description: '',
		stockType: '',
		image: null
	}
}
