import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'
import React, { useRef, useState } from 'react'
import { Field, Form } from 'react-final-form'

export default function PopupCreateProfile({
	data,
	show,
	setShow,
	afterSaveCallback,
	isNew
}) {
	const [profile, setProfile] = useState(data)
	const [totalSize, setTotalSize] = useState(0)
	const toast = useRef(null)
	const form = useRef(null)
	let submit

	const validate = (data) => {
		let errors = { email: null, phone: null, role: null }
		let hasError = false

		if (!data.email) {
			errors.email = 'Email é Obrigatório.'
			hasError = true
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
			errors.email = 'Endereço de e-mail inválido. E.g. example@email.com'
			hasError = true
		}

		if (!data.phone) {
			errors.phone = 'Telefone é Obrigatório.'
			hasError = true
		} else if (/\(\d{2}\)[ ]\d{5}\-\d{5}/g.test(data.phone)) {
			console.log('TESTANDO ' + data.phone)
			errors.phone = 'Formato inválido. E.g. (DD) 9XXXX-XXXX'
			hasError = true
		}

		/*
		if (!data.role) {
			errors.role = 'Perfil é Obrigatório.'
		}*/
		if (!hasError) {
			return {}
		}
		return errors
	}

	const hideDialog = () => {
		setShow(false)
	}

	const onSubmit = (data, form) => {
		console.log(JSON.stringify(data))
		form.restart()
	}

	const isFormFieldValid = (meta) => !!(meta.touched && meta.error)
	const getFormErrorMessage = (meta) => {
		return (
			isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
		)
	}

	// Profile dialog Footer, buttons SAVE and CANCEL
	const dialogFooter = (
		<React.Fragment>
			<Button
				label="Cancel"
				icon="pi pi-times"
				className="p-button-text"
				onClick={hideDialog}
			/>
			<Button
				type="submit"
				label="Save"
				icon="pi pi-check"
				className="p-button-text"
				onClick={(event) => {
					submit(event)
				}}
			/>
		</React.Fragment>
	)

	return (
		<div>
			<Toast ref={toast} />
			<Dialog
				className="p-fluid"
				style={{ width: '450px' }}
				header="Detalhes do Perfil"
				modal
				onHide={hideDialog}
				visible={show}
				footer={dialogFooter}
				onShow={null}
			>
				<Form
					ref={form}
					onSubmit={onSubmit}
					initialValues={{
						email: '',
						phone: '',
						role: '',
						bio: ''
					}}
					validate={validate}
					render={({ handleSubmit }) => {
						submit = handleSubmit
						return (
							<form onSubmit={handleSubmit} className="p-fluid">
								<div>
									<div className="pb-1">
										<label>Email</label>
									</div>
									<Field
										name="email"
										render={({ input, meta }) => (
											<div className="field">
												<span className="p-float-label p-input-icon-right">
													<i className="pi pi-envelope" />
													<InputText
														id="email"
														{...input}
														className={classNames({
															'p-invalid': isFormFieldValid(meta)
														})}
													/>
													<label
														htmlFor="email"
														className={classNames({
															'p-error': isFormFieldValid(meta)
														})}
													></label>
												</span>
												{getFormErrorMessage(meta)}
											</div>
										)}
									/>
								</div>
								<div>
									<div className="pb-1">
										<label>Phone</label>
									</div>
									<Field
										name="phone"
										render={({ input, meta }) => (
											<div className="field">
												<span className="p-float-label p-input-icon-right">
													<i className="pi pi-phone" />
													<InputMask
														id="phone"
														mask="(99) 99999-9999"
														{...input}
														className={classNames({
															'p-invalid': isFormFieldValid(meta)
														})}
													/>
													<label
														htmlFor="phone"
														className={classNames({
															'p-error': isFormFieldValid(meta)
														})}
													></label>
												</span>
												{getFormErrorMessage(meta)}
											</div>
										)}
									/>
								</div>
							</form>
						)
					}}
				/>
			</Dialog>
		</div>
	)
}
