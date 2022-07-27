import IProfileData from 'src/types/Profile'
import http from 'src/http-common'

const create = (data: IProfileData) => {
	return http.post<IProfileData>('/profile', data)
}
const update = (data: IProfileData) => {
	return http.put<IProfileData>('/profile', data)
}
const exclude = (data: IProfileData) => {
	return http.delete<IProfileData>('/profile?id=' + data.id)
}
const listAll = () => {
	return http.get<IProfileData[]>('/profile')
}

const ProfileService = {
	create,
	update,
	exclude,
	listAll
}

export default ProfileService
