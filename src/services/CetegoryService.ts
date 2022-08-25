import http from 'src/http-common'
import ICategoryData from 'src/types/Category'

const create = (data: ICategoryData) => {
	return http.post<ICategoryData>('/category/create', data)
}
const update = (data: ICategoryData) => {
	return http.put<ICategoryData>('/category/update', data)
}
const exclude = (data: ICategoryData) => {
	return http.delete<ICategoryData>('/category/delete?id=' + data.id)
}
const listAll = () => {
	return http.get<ICategoryData[]>('/category/listAll')
}

const CategoryService = {
	create,
	update,
	exclude,
	listAll
}

export default CategoryService
