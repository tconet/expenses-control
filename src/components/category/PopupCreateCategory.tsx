import React, { useRef, useState } from 'react'
import CategoryService from 'src/services/CetegoryService'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { FileUpload } from 'primereact/fileupload'
import { classNames } from 'primereact/utils'
import { ProgressBar } from 'primereact/progressbar'
import { Tag } from 'primereact/tag'

export default function PopupCreateCategory({
	data,
	show,
	setShow,
	afterSaveCategory,
	isNew
}) {
	const [submitted, setSubmitted] = useState(false)
	const [category, setCategory] = useState(data)
	const [totalSize, setTotalSize] = useState(0)
	const [showFileUpload, setShowFileUpload] = useState(false)
	const fileUploadRef = useRef(null)
	const inputName = useRef(null)
	const toast = useRef(null)

	// Form item change. Update the current category object.
	const onInputChange = (e, name) => {
		const val = (e.target && e.target.value) || ''
		let _category = { ...category }
		_category[`${name}`] = val

		setCategory(_category)
	}

	// Funciton to hides the category Dialog.
	const hideDialog = () => {
		setSubmitted(false)
		setShow(false)
	}

	const onTemplateRemove = (file, callback) => {
		setTotalSize(totalSize - file.size)
		callback()
	}

	const onTemplateClear = () => {
		setTotalSize(0)
	}

	// Saves the Category
	const saveCategory = async () => {
		setSubmitted(true)

		// Field name is mandatory
		if (category.name?.trim()) {
			const resp = isNew
				? await CategoryService.create(category)
				: await CategoryService.update(category)

			afterSaveCategory(resp.data)
			setShow(false)
		}
	}

	// After upload the category image
	// receive the image and update the category object.
	// update the total file size, and show the success message on toast.
	const onTemplateUpload = (e) => {
		let _totalSize = 0
		e.files.forEach((file) => {
			_totalSize += file.size || 0
		})

		const req: XMLHttpRequest = e.xhr
		category.image = req.response
		setCategory(category)

		setTotalSize(_totalSize)
		toast.current.show({
			severity: 'info',
			summary: 'Success',
			detail: 'File Uploaded'
		})
		setShowFileUpload(false)
	}

	// Clear the category object if it's new
	const onShowDialog = () => {
		setShowFileUpload(isNew)
		if (isNew) {
			setSubmitted(false)
			let _category = { ...category }
			_category.id = null
			_category.name = ''
			setCategory(_category)
		} else {
			setCategory(data)
		}
	}

	// Category Dialog Footer, BUTTONS save and cancel
	const categoryDialogFooter = (
		<React.Fragment>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDialog}
			/>
			<Button
				label="Save"
				icon="pi pi-check"
				className="p-button-text"
				onClick={saveCategory}
			/>
		</React.Fragment>
	)

	// IMAGE UPLOADER TEMPLATE.
	const imageTemplate = () => {
		return (
			<div className="flex align-items-center flex-column">
				<i
					className="pi pi-image mt-3 p-5"
					style={{
						fontSize: '5em',
						borderRadius: '50%',
						backgroundColor: 'var(--surface-b)',
						color: 'var(--surface-d)'
					}}
				></i>
				<span
					style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
					className="my-5"
				>
					Drag and Drop Image Here
				</span>
			</div>
		)
	}

	const headerTemplate = (options) => {
		const { className, chooseButton, uploadButton, cancelButton } = options
		const value = totalSize / 10000
		const formatedValue =
			fileUploadRef && fileUploadRef.current
				? fileUploadRef.current.formatSize(totalSize)
				: '0 B'

		return (
			<div
				className={className}
				style={{
					display: 'flex',
					alignItems: 'center'
				}}
			>
				{chooseButton}
				{uploadButton}
				<ProgressBar
					value={value}
					displayValueTemplate={() => `${formatedValue} / 1 MB`}
					style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
				></ProgressBar>
			</div>
		)
	}

	const itemTemplate = (file, props) => {
		return (
			<div className="flex align-items-center flex-wrap">
				<div className="flex align-items-center" style={{ width: '40%' }}>
					<img
						alt={file.name}
						role="presentation"
						src={file.objectURL}
						width={100}
					/>
				</div>
				<Tag
					value={props.formatSize}
					severity="warning"
					className="px-3 py-2"
				/>
				<Button
					type="button"
					icon="pi pi-times"
					className="p-button-raised p-button-danger ml-auto w-2"
					onClick={() => onTemplateRemove(file, props.onRemove)}
				/>
			</div>
		)
	}

	// IMAGE UPLOADER BUTTONS OPTIONS.
	const chooseOptions = {
		icon: 'pi pi-images',
		iconOnly: true,
		className: 'p-button-raised p-button-primary w-2'
	}
	const uploadOptions = {
		icon: 'pi pi-cloud-upload',
		iconOnly: true,
		className: 'p-button-raised p-button-danger w-2'
	}
	const cancelOptions = {
		icon: 'pi pi-times',
		iconOnly: true,
		className: 'p-button-raised p-button-danger w-2'
	}

	return (
		<div>
			<Toast ref={toast} />
			<Dialog
				className="p-fluid"
				style={{ width: '450px' }}
				header="Detalhes da Categoria"
				modal
				onHide={hideDialog}
				visible={show}
				footer={categoryDialogFooter}
				onShow={onShowDialog}
			>
				{/* CATEGORY IMAGE */}
				<div className="field">
					<h5>Image</h5>
					{!showFileUpload ? (
						<div className="flex align-middle pt-2 pb-2 pl-1 rounded-md">
							<div className="align-middle">
								<img
									src={category.image}
									alt="Image"
									className="w-3rem shadow-2 rounded-md"
								/>
							</div>
							<div className="align-middle pl-2">
								<Button
									label="Click para Alterar"
									className="p-button-text "
									onClick={() => setShowFileUpload(true)}
								/>
							</div>
						</div>
					) : (
						<FileUpload
							ref={fileUploadRef}
							name="file"
							url="api/category/upload"
							accept="image/*"
							multiple
							maxFileSize={1000000}
							emptyTemplate={imageTemplate}
							headerTemplate={headerTemplate}
							onUpload={onTemplateUpload}
							itemTemplate={itemTemplate}
							onClear={onTemplateClear}
							onError={onTemplateClear}
							chooseOptions={chooseOptions}
							uploadOptions={uploadOptions}
							cancelOptions={cancelOptions}
						/>
					)}
				</div>
				{/* CATEGORY NAME */}
				<div className="field">
					<label htmlFor="name">Name</label>
					<InputText
						id="name"
						ref={inputName}
						value={category.name}
						onChange={(e) => onInputChange(e, 'name')}
						required
						autoFocus
						className={classNames({
							'p-invalid': submitted && !category.name
						})}
					/>
					{submitted && !category.name && (
						<small className="p-error">Nome é obrigatório.</small>
					)}
				</div>
			</Dialog>
		</div>
	)
}
