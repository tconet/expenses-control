import Layout from 'src/components/Layout'
import { Card } from 'primereact/card'
import { read, utils } from 'xlsx'
import { useState } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FileUpload } from 'primereact/fileupload'

// https://docs.sheetjs.com/docs/demos/react
// Video base. https://www.youtube.com/watch?v=GUFzw4jo_E4
export default function Negotiations() {
	const [fileName, setFileName] = useState(null)
	const [loadingFile, setLoadingFile] = useState(false)

	const [importedCols, setImportedCols] = useState([])
	const [importedData, setImportedData] = useState([])

	//TODO: Only for now, we'll remove this code soon
	const onLoadingClick = () => {
		setLoadingFile(true)

		setTimeout(() => {
			setLoadingFile(false)
		}, 2000)
	}

	// Clear all necessary infromations.
	const clear = () => {
		setFileName(null)
		setImportedData([])
		setImportedCols([])
	}

	// Uploads the EXCEL file with all stock negotiations.
	// First parse the file and then build the columns and the
	// the table content, to present all informations to the user
	// before import
	const onUploadFile = async (e) => {
		// Get the file informations
		const file = e.files[0]

		// Exists?
		if (file) {
			// Set the file name
			setFileName(file.name)

			// Parse the content from .XLS to JSON
			const data = await file.arrayBuffer()
			const wb = read(data)
			const values = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])

			// Get all columns and than filter the result to remove
			// some columns that we don't want.
			const first = values[0]
			const columns = Object.keys(first)
			const cols = columns.filter(
				(obj) => obj != 'Mercado' && obj != 'Prazo/Vencimento'
			)

			// Filtered Columns
			setImportedCols(cols)
			// All Values
			setImportedData(values)
		}
	}

	return (
		<Layout>
			<div>
				<Card title="Importar Negociações" className="max-w-5xl mx-auto mt-5 ">
					<p className="mt-1 mb-2">
						O conteúdo do arquivo importado subistituirá todas as Negociações
						encontras na base de dados, caso existam, de acordo o ANO das
						Movimentações. Tenha certza que deseja realizar essa operação, uma
						vez feita, não será possível desfaze-lá.
					</p>

					<div className="flex align-items-center py-2">
						<FileUpload
							chooseOptions={{
								label: 'Excel',
								icon: 'pi pi-file-excel',
								className: 'p-button-success'
							}}
							mode="basic"
							name="demo[]"
							auto
							url="/api/upload"
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							className="mr-2"
							onUpload={onUploadFile}
						/>
						<Button
							label="Importar"
							iconPos="right"
							loading={loadingFile}
							onClick={onLoadingClick}
						/>
						<Button
							type="button"
							label="Clear"
							icon="pi pi-times"
							className="p-button-info ml-auto"
							onClick={clear}
						/>
					</div>
					{fileName && (
						<div className="items-start flex-items mt-3">
							<p className="font-bold mb-1">Nome do Arquivo</p>
							<p className="mb-1 text-yellow-500">{fileName}</p>
						</div>
					)}

					<DataTable
						value={importedData}
						emptyMessage="No data"
						paginator
						rows={10}
						alwaysShowPaginator={false}
						responsiveLayout="scroll"
						selectionMode="multiple"
					>
						{importedCols.map((cols, index) => {
							return <Column key={index} field={cols} header={cols} />
						})}
					</DataTable>
				</Card>
			</div>
		</Layout>
	)
}
