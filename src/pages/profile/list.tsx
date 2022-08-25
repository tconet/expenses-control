import React, { useEffect, useRef, useState } from 'react'
import ProfileService from 'src/services/ProfileService'
import IProfileData from 'src/types/Profile'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import Layout from 'src/components/Layout'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { ConfirmPopup } from 'primereact/confirmpopup'
import PopupCreateProfile from 'src/components/profile/PopupCreateProfile'

export default function ProfileList() {
	let noStateProfile: IProfileData = {
		id: null,
		email: null,
		phone: null,
		role: null,
		bio: null
	}

	const [profile, setProfile] = useState(noStateProfile)
	const [profiles, setContent] = useState<IProfileData[]>()
	const [globalFilter, setGlobalFilter] = useState(null)
	const [showPopup, setShowPopup] = useState(false)
	const toast = useRef(null)
	const dt = useRef(null)

	// List all profiles from service.
	// Client side call. Better performance.
	useEffect(() => {
		const fetchData = async () => {
			const res = await ProfileService.listAll()
			if (res.data) {
				setContent(res.data)
			}
		}
		fetchData()
	}, [])

	// NEW Profile button action
	// Set the isNew flag to true, mean that we want to create a new profile
	// set the current profile to it's empty representation.
	// shows the profile popup
	const openNew = () => {
		setProfile(noStateProfile)
		setShowPopup(true)
	}

	// Left TOOLBAR template only with the NEW button
	const leftToolbarTemplate = () => {
		return (
			<React.Fragment>
				<Button
					label="Nova"
					icon="pi pi-plus"
					className="p-button-primary mr-2"
					onClick={openNew}
				/>
			</React.Fragment>
		)
	}

	// TABLE Header
	const header = (
		<div className="flex items-center justify-between">
			<h5 className="mx-0 my-1">Gerênciar Perfis</h5>
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText
					type="search"
					onInput={(e) => setGlobalFilter(e.target.value)}
					placeholder="Search..."
				/>
			</span>
		</div>
	)

	// TABLE Actions column EDIT and DELETE buttons
	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<ConfirmPopup />
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-primary mr-2"
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-danger"
				/>
			</React.Fragment>
		)
	}

	return (
		<Layout>
			<div className="overflow-x-auto relative shadow-md sm:rounded-l w-3/4 max-w-2xl mx-auto p-5 mt-2">
				<Toast ref={toast} />
				{/** PROFILES TABLE */}
				<div className="card">
					<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
					<DataTable
						ref={dt}
						value={profiles}
						dataKey="id"
						header={header}
						responsiveLayout="scroll"
						globalFilter={globalFilter}
					>
						<Column
							field="role"
							header="Perfil"
							sortable
							style={{ minWidth: '8rem' }}
						></Column>
						<Column
							field="email"
							header="E-mail"
							sortable
							style={{ minWidth: '16rem' }}
						></Column>
						<Column
							body={actionBodyTemplate}
							exportable={false}
							style={{ minWidth: '8rem' }}
						></Column>
					</DataTable>
				</div>

				{/** MANAGER PROFILE POPUP */}
				<PopupCreateProfile
					data={profile}
					show={showPopup}
					setShow={setShowPopup}
					afterSaveCallback={null}
					isNew={true}
				></PopupCreateProfile>
			</div>
		</Layout>
	)
}
