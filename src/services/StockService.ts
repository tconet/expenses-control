import http from 'src/http-common'
import IStockData from 'src/types/Stocks'

const create = (data: IStockData) => {
	return http.post<IStockData>('/stock/create', data)
}
const update = (data: IStockData) => {
	return http.put<IStockData>('/stock/update', data)
}
const exclude = (data: IStockData) => {
	return http.delete<IStockData>('/stock?delete?id=' + data.id)
}
const listAll = () => {
	return http.get<IStockData[]>('/stock/listAll')
}

const StockService = {
	create,
	update,
	exclude,
	listAll
}

export default StockService
