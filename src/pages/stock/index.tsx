import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { ConfirmPopup } from 'primereact/confirmpopup'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Toolbar } from 'primereact/toolbar'
import React, { useEffect, useRef, useState } from 'react'
import Layout from 'src/components/Layout'
import StockService from 'src/services/StockService'
import { createEmpty } from 'src/types/Stocks'

/**
 * CRUD Interface for Stock management.
 * This time, we'll be using primefaces components.
 */
export default function Stock() {
	const [stock, setStock] = useState(null)
	const [stocks, setStocks] = useState(null)
	const [globalFilter, setGlobalFilter] = useState(null)
	const [stockDialog, setStockDialog] = useState(false)
	const toast = useRef(null)
	const [isNew, setIsNew] = useState(true)

	// List all entities from service.
	// Client side call. Better performance.
	useEffect(() => {
		const fetchData = async () => {
			const res = await StockService.listAll()
			if (res.data) {
				setStocks(res.data)
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
		setStock(createEmpty())
		setStockDialog(true)
	}

	// Left TOOLBAR template only contains the NEW button
	const leftToolbarTemplate = () => {
		return (
			<React.Fragment>
				<Button
					label="Nova"
					icon="pi pi-plus"
					className="p-button-primary mr-2"
				/>
			</React.Fragment>
		)
	}

	// TABLE Header
	const header = (
		<div className="flex items-center justify-between">
			<h5 className="mx-0 my-1">Gerênciar Ações</h5>
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

	// TABLE Stock Type Column
	const typeBody = (rowData) => {
		return <label>{rowData.stockType == 'STOCK' ? 'Ação' : 'FII'}</label>
	}

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
			<div className="overflow-x-auto relative shadow-md sm:rounded-l w-3/4 max-w-4xl mx-auto p-5 mt-2">
				<Toast ref={toast} />
				{/** STOCKS TABLE */}
				<div className="card">
					<Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
					<DataTable
						value={stocks}
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
							field="stockType"
							header="Tipo"
							sortable
							body={typeBody}
						></Column>
						<Column
							field="symbol"
							header="Ticker"
							sortable
							style={{ minWidth: '8rem' }}
						></Column>
						<Column
							field="company_name"
							header="Nome da Empresa"
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
			</div>
		</Layout>
	)
}
