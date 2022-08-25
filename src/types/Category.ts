export default interface ICategoryData {
	id?: string | null
	name: string
	image?: string
}

export function createEmpty(): ICategoryData {
	return {
		id: null,
		name: '',
		image: null
	}
}
