import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'
import React, { useRef, useState } from 'react'

export default function PopupCreateCategory({
	data,
	show,
	setShow,
	afterSaveCallback,
	isNew
}) {
	const [submitted, setSubmitted] = useState(false)
	const [stock, setStock] = useState(data)
	const [totalSize, setTotalSize] = useState(0)
	const toast = useRef(null)

	// Funciton to hides the Dialog.
	const hideDialog = () => {
		setSubmitted(false)
		setShow(false)
	}

	const chooseOptions = {
		icon: 'pi pi-fw pi-images',
		iconOnly: true,
		className: 'custom-choose-btn p-button-rounded p-button-outlined'
	}
	const uploadOptions = {
		icon: 'pi pi-fw pi-cloud-upload',
		iconOnly: true,
		className:
			'custom-upload-btn p-button-success p-button-rounded p-button-outlined'
	}
	const cancelOptions = {
		icon: 'pi pi-fw pi-times',
		iconOnly: true,
		className:
			'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
	}

	// Dialog Footer, BUTTONS save and cancel
	const dialogFooter = (
		<React.Fragment>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDialog}
			/>
			<Button label="Save" icon="pi pi-check" className="p-button-text" />
		</React.Fragment>
	)
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
				footer={dialogFooter}
			>
				{/* IMAGE */}
				<div className="field">
					<h5>Image</h5>
				</div>
				{/* NAME */}
				<div className="field">
					<label htmlFor="name">Name</label>
					<InputText
						id="name"
						value={stock.name}
						required
						autoFocus
						className={classNames({
							'p-invalid': submitted && !stock.name
						})}
					/>
					{submitted && !stock.name && (
						<small className="p-error">Nome é obrigatório.</small>
					)}
				</div>
			</Dialog>
		</div>
	)
}
