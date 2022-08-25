import React, { useEffect, useRef, useState } from 'react'
import CategoryService from 'src/services/CetegoryService'
import ICategoryData from 'src/types/Category'
import { createEmpty } from 'src/types/Category'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'
import Layout from 'src/components/Layout'
import PopupCreateCategory from 'src/components/category/PopupCreateCategory'

/**
 * CRUD Interface for Category controls.
 * This time, we'll be using primefaces components.
 */
export default function Category() {
	let noStateCategory: ICategoryData = {
		id: null,
		name: '',
		image: null
	}

	// Creates all necessy states and reference.
	const [categories, setCategories] = useState(null)
	const [globalFilter, setGlobalFilter] = useState(null)
	const [categoryDialog, setCategoryDialog] = useState(false)
	const [category, setCategory] = useState(createEmpty())
	const toast = useRef(null)
	const dt = useRef(null)
	const [isNew, setIsNew] = useState(true)

	// List all categories from service.
	// Client side call. Better performance.
	useEffect(() => {
		const fetchData = async () => {
			const res = await CategoryService.listAll()
			if (res.data) {
				setCategories(res.data)
			}
		}
		fetchData()
	}, [])

	// NEW Category button action
	// Set the isNew flag to true, mean that we want to create a new category
	// set the current category to it's empty representation.
	// shows the category popup
	const openNew = () => {
		setIsNew(true)
		setCategory(createEmpty())
		setCategoryDialog(true)
	}
	// EDIT Category button action
	// Set the isNew flag to false
	// Set the currente category with the new value.
	// And show the popup to update the category
	const openEdit = (rowData) => {
		setIsNew(false)
		setCategory(rowData)
		setCategoryDialog(true)
	}

	// Update the list of categories with the new data
	// or just update the selected one.
	const afterSaveCategory = async (data) => {
		let _category = { ...data }
		let _categories = [...categories]
		let message = ''

		// If the does not existe, means a new one.
		// otherwise, just an update.
		if (category.id) {
			const index = findIndexById(category.id)
			_categories[index] = _category
			message = 'Categoria Atualizada'
		} else {
			_categories.push(_category)
			message = 'Categoria criada com Sucesso!'
		}
		toast.current.show({
			severity: 'success',
			summary: 'Successful',
			detail: message,
			life: 3000
		})
		setCategories(_categories)
		setCategory(createEmpty())
	}

	// Find the category index into the list of categories base on it's id.
	const findIndexById = (id) => {
		let index = -1
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].id === id) {
				index = i
				break
			}
		}
		return index
	}

	// On delete category confirmation button.
	const accept = async () => {
		// Call the service do delete the category.
		await CategoryService.exclude(noStateCategory)

		// Remove the deleted one from the current list of categories...
		let _categories = categories.filter((val) => val.id !== noStateCategory.id)
		setCategories(_categories)

		toast.current.show({
			severity: 'info',
			summary: 'Confirmed',
			detail: 'Categoria Excluída',
			life: 3000
		})
	}

	// On delete event, show the popup to the user.
	const onDelete = (event, rowData) => {
		const _category = { ...rowData }
		noStateCategory = _category
		setCategory(_category)

		confirmPopup({
			target: event.currentTarget,
			message: 'Deseja realmente excluir essa categoria?',
			icon: 'pi pi-exclamation-triangle',
			accept
		})
	}

	// Left TOOLBAR template only contains the NEW button
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
			<h5 className="mx-0 my-1">Gerênciar Categorias</h5>
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

	// TABLE Image Column
	const imageBodyTemplate = (rowData) => {
		return (
			<img
				src={rowData.image}
				onError={(e) =>
					(e.target.src =
						'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')
				}
				alt={rowData.image}
				className="w-3rem shadow-2 rounded-md"
			/>
		)
	}

	// TABLE Actions column EDIT and DELETE buttons
	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<ConfirmPopup />
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-primary mr-2"
					onClick={(e) => openEdit(rowData)}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-danger"
					onClick={(e) => onDelete(e, rowData)}
				/>
			</React.Fragment>
		)
	}

	return (
		<Layout>
			<div className="overflow-x-auto relative shadow-md sm:rounded-l w-3/4 max-w-2xl mx-auto p-5 mt-2">
				<Toast ref={toast} />
				{/** CATEGORIES TABLE */}
				<div className="card">
					<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
					<DataTable
						ref={dt}
						value={categories}
						dataKey="id"
						header={header}
						responsiveLayout="scroll"
						globalFilter={globalFilter}
					>
						<Column
							field="image"
							header="Image"
							body={imageBodyTemplate}
						></Column>
						<Column
							field="name"
							header="Name"
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

				{/** MANAGER CATEGORY POPUP */}
				<PopupCreateCategory
					data={category}
					show={categoryDialog}
					setShow={setCategoryDialog}
					afterSaveCategory={afterSaveCategory}
					isNew={isNew}
				></PopupCreateCategory>
			</div>
		</Layout>
	)
}
