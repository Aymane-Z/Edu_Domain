import { $t } from 'hooks/i18n';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { CanView } from 'components/Can';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ExportPageData } from 'components/ExportPageData';
import { FilterTags } from 'components/FilterTags';
import { ImportPageData } from 'components/ImportPageData';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { PageRequestError } from 'components/PageRequestError';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SplitButton } from 'primereact/splitbutton';
import { Title } from 'components/Title';
import { useState } from 'react';

import { Dialog } from 'primereact/dialog';
import ClientViewPage from 'pages/client/View';
import DossierlocationViewPage from 'pages/dossierlocation/View';
import UnitelocationViewPage from 'pages/unitelocation/View';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import UsersnodeViewPage from 'pages/usersnode/View';
import useUtils from 'hooks/useUtils';

import useListPage from 'hooks/useListPage';
const ReclamationListPage = (props) => {
		const auth = useAuth();
	const app = useApp();
	const utils = useUtils();
	const filterSchema = {
		search: {
			tagTitle: $t('search'),
			value: '',
			valueType: 'single',
			options: [],
		}
	}
	const pageController = useListPage(props, filterSchema);
	const filterController = pageController.filterController;
	const { records, pageReady, loading, selectedItems, apiUrl, sortBy, sortOrder, apiRequestError, setSelectedItems, getPageBreadCrumbs, onSort, deleteItem, pagination } = pageController;
	const { filters, setFilterValue } = filterController;
	const { totalRecords, totalPages, recordsPosition, firstRow, currentPage, limit, onPageChange } =  pagination;
	const [dialogVisible, setDialogVisible] = useState(false);
	function ActionButton(data){
		const items = [
		{
			label: $t('view'),
			command: (event) => { app.navigate(`/reclamation/view/${data.id}`) },
			icon: "pi pi-eye",
			visible: () => auth.canView('reclamation/view')
		},
		{
			label: $t('accepter'),
			command: (event) => { app.navigate(`/reclamation/edit/${data.id}`) },
			icon: "pi pi-check-square",
			visible: () => auth.canView('reclamation/edit')
		},
		{
			label: $t('affecter'),
			command: (event) => { app.navigate(`/reclamation/edit/${data.id}`) },
			icon: "pi pi-user-plus",
			visible: () => auth.canView('reclamation/edit')
		},
		{
			label: $t('cloturer'),
			command: (event) => { app.navigate(`/reclamation/edit/${data.id}`) },
			icon: "pi pi-file-check",
			visible: () => auth.canView('reclamation/edit')
		},
		{
			label: $t('rejeter'),
			command: (event) => { deleteItem(data.id) },
			icon: "pi pi-times",
			visible: () => auth.canView('reclamation/delete')
		}
	]
	.filter((item) => {
		if(item.visible){
			return item.visible()
		}
		return true;
	});
		return (<SplitButton dropdownIcon="pi pi-bars" className="dropdown-only p-button-text p-button-plain" model={items} />);
	}
	function StatusTemplate(data){
		if(data){
			return (
				<><Chip label={data.status} style={{ backgroundColor: getStatusColor(data.status), color: 'white' }} /></>
			);
		}
	}
	function IdClientTemplate(data){
		if(data){
			return (
				<>{data.id_client && <Button className="p-button-text" icon="pi pi-eye" label={data.client_nom_prenom} onClick={() => app.openPageDialog(<ClientViewPage isSubPage apiPath={`/client/view/${data.id_client}`} />, {closeBtn: true })} /> }</>
			);
		}
	}
	function IdUniteLocationTemplate(data){
		if(data){
			return (
				<>{data.id_unite_location && <Button className="p-button-text" icon="pi pi-eye" label={data.unitelocation_code} onClick={() => app.openPageDialog(<UnitelocationViewPage isSubPage apiPath={`/unitelocation/view/${data.id_unite_location}`} />, {closeBtn: true })} /> }</>
			);
		}
	}
	function IdDossierlocationTemplate(data){
		if(data){
			return (
				<>{data.id_dossierlocation && <Button className="p-button-text" icon="pi pi-eye" label={$t('dossierLocation')} onClick={() => app.openPageDialog(<DossierlocationViewPage isSubPage apiPath={`/dossierlocation/view/${data.id_dossierlocation}`} />, {closeBtn: true })} /> }</>
			);
		}
	}
	function UserIdTemplate(data){
		if(data){
			return (
				<>{data.user_id && <Button className="p-button-text" icon="pi pi-eye" label={data.usersnode_email} onClick={() => app.openPageDialog(<UsersnodeViewPage isSubPage apiPath={`/usersnode/view/${data.user_id}`} />, {closeBtn: true })} /> }</>
			);
		}
	}
	function DateCreatedTemplate(data){
		if(data){
			return (
				<>{data.date_created && <Button className="p-0 p-button-plain p-button-text" label={utils.relativeDate(data.date_created)} tooltip={utils.humanDatetime(data.date_created)} />}</>
			);
		}
	}
	function DateUpdatedTemplate(data){
		if(data){
			return (
				<>{data.date_updated && <Button className="p-0 p-button-plain p-button-text" label={utils.relativeDate(data.date_updated)} tooltip={utils.humanDatetime(data.date_updated)} />}</>
			);
		}
	}
	function PageLoading(){
		if(loading){
			return (
				<>
					<div className="flex align-items-center justify-content-center text-gray-500 p-3">
						<div><ProgressSpinner style={{width:'30px', height:'30px'}} /> </div>
						<div  className="font-bold text-lg">{$t('loading')}</div>
					</div>
				</>
			);
		}
	}
	function EmptyRecordMessage(){
		if(pageReady && !records.length){
			return (
				<div className="text-lg mt-3 p-3 text-center text-400 font-bold">
					{$t('aucunEnregistrementTrouv')}
				</div>
			);
		}
	}
	function MultiDelete() {
		if (selectedItems.length) {
			return (
				<div className="m-2 flex-grow-0">
					<Button onClick={() => deleteItem(selectedItems)} icon="pi pi-trash" className="p-button-danger" title={$t('deleteSelected')}/>
				</div>
			)
		}
	}
	function ExportData() {
		if (props.exportData && records.length) {
			const downloadFileName = `${utils.dateNow()}-reclamation`;
			return (
				<div className="m-2">
					<ExportPageData  pageUrl={apiUrl} downloadFileName={downloadFileName} butonLabel={$t('exporter')} tooltip={$t('export')} buttonIcon="pi pi-print" />
				</div>
			);
		}
	}
	function ImportData() {
		if (props.importData) {
			return (
				<div className="m-2">
					<ImportPageData label={$t('selectAFileToImport')} uploadPath="reclamation/importdata" buttonIcon="pi pi-folder" buttonLabel={$t('importData')} onImportCompleted={(response) => {app.flashMsg('Import Data', response, 'success')}} />
				</div>
			);
		}
	}
	function PagerControl() {
		if (props.paginate && totalPages > 1) {
		const pagerReportTemplate = {
			layout: pagination.layout,
			CurrentPageReport: (options) => {
				return (
					<>
						<span className="text-sm text-gray-500 px-2">{$t('page')} <b>{ options.currentPage } {$t('of')} { options.totalPages }</b></span>
						<span className="text-sm text-gray-500 px-2">{$t('records')} <b>{ recordsPosition } {$t('of')} { options.totalRecords }</b></span>
					</>
				);
			}
		}
		return (
			<div className="flex-grow-1">
				<Paginator first={firstRow} rows={limit} totalRecords={totalRecords}  rowsPerPageOptions={[5, 10, 20, 30, 50, 100, 200, 500, 1000]}  onPageChange={onPageChange} template={pagerReportTemplate} />
			</div>
		)
		}
	}
	const dialogFooterTemplate = () => {
        return <Button label="Ok" icon="pi pi-check" onClick={() => setDialogVisible(false)} />;
    };
	function PageActionButtons() {
		return (
			<div className="flex flex-wrap">
	<CanView pagePath="reclamation/delete">
		<MultiDelete />
	</CanView>
				<ExportData />
	<CanView pagePath="reclamation/importdata">
		<ImportData />
	</CanView>
			</div>
		);
	}
	function PageFooter() {
		if (pageReady && props.showFooter) {
			return (
				<div className="flex flex-wrap">
					<PageActionButtons />
					<PagerControl />
				</div>
			);
		}
	}
	function PageBreadcrumbs(){
		if(props.showBreadcrumbs) {
			const items = getPageBreadCrumbs();
			return (items.length > 0 && <BreadCrumb className="mb-3" model={items} />);
		}
	}
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
const getStatusColor = (status) => {
  if (!status) return 'grey';
  switch (status.toLowerCase()) {
      case 'ouvert': return 'blue';
    case 'en attente': return 'yellow';
    case 'resolue': return 'green';
    case 'rejetee': return 'red';
    case 'fermee': return 'black';
    default: return 'grey';
  }
};
	return (
<main id="ReclamationListPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title={$t('reclamation')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
                <div className="col-fixed " >
                    <CanView pagePath={props.apiPath}>
                        <Link to={`/reclamation/add`}>
                            <Button label={$t('addNewReclamation')} icon="pi pi-plus" type="button" className="p-button w-full bg-primary "  />
                            </Link>
                        </CanView>
                    </div>
                    <div className="col-12 md:col-3 " >
                        <div className="p-inputgroup flex-1 mb-3">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-search"></i>
                            </span>
                                <InputText placeholder={$t('search')} className="w-full" value={filters.search.value}  onChange={(e) => setFilterValue('search', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        }
        <section className="page-section " >
            <div className="container-fluid">
                <div className="grid ">
                    <div className="col comp-grid" >
                        <FilterTags filterController={filterController} />
                        <div >
                            <PageBreadcrumbs />
                            <div className="page-records">
                                <DataTable 
                                    lazy={true} 
                                    loading={loading} 
                                    selectionMode="checkbox" selection={selectedItems} onSelectionChange={e => setSelectedItems(e.value)}
                                    value={records} 
                                    dataKey="id" 
                                    sortField={sortBy} 
                                    sortOrder={sortOrder} 
                                    onSort={onSort}
                                    className=" p-datatable-sm" 
                                    stripedRows={true}
                                    showGridlines={false} 
                                    rowHover={true} 
                                    responsiveLayout="stack" 
                                    emptyMessage={<EmptyRecordMessage />} 
                                    >
                                    {/*PageComponentStart*/}
                                    <Column selectionMode="multiple" headerStyle={{width: '2rem'}}></Column>
                                    <Column  field="status" header={$t('status')} body={StatusTemplate} sortable={true} ></Column>
                                    <Column  field="type" header={$t('type')}  sortable={true} ></Column>
                                    <Column  field="id_client" header={$t('client')} body={IdClientTemplate} sortable={true} ></Column>
                                    <Column  field="id_unite_location" header={$t('uniteDeLocation')} body={IdUniteLocationTemplate} sortable={true} ></Column>
                                    <Column  field="id_dossierlocation" header={$t('dossierDeLocation')} body={IdDossierlocationTemplate} sortable={true} ></Column>
                                    <Column  field="user_id" header={$t('user')} body={UserIdTemplate} sortable={true} ></Column>
									
                                    <Column  field="description" header={$t('description')}  sortable={true} ></Column>
									
                                    <Column  field="date_created" header={$t('dateCreated')} body={DateCreatedTemplate} sortable={true} ></Column>
                                    <Column  field="date_updated" header={$t('dateUpdated')} body={DateUpdatedTemplate} sortable={true} ></Column>
                                    <Column  field="date_resolue" header={$t('dateResolue')}  sortable={true} ></Column>
                                    <Column headerStyle={{width: '2rem'}} headerClass="text-center" body={ActionButton}></Column>
                                    {/*PageComponentEnd*/}
                                </DataTable>
                            </div>
                            <PageFooter />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
	);
}
ReclamationListPage.defaultProps = {
	primaryKey: 'id',
	pageName: 'reclamation',
	apiPath: 'reclamation/index',
	routeName: 'reclamationlist',
	msgBeforeDelete: $t('tesVousSrDeVouloirSupprimerCetEnregistrement'),
	msgTitle: $t('deleteRecord'),
	msgAfterDelete: $t('enregistrementSupprimAvecSuccs'),
	showHeader: true,
	showFooter: true,
	paginate: true,
	isSubPage: false,
	showBreadcrumbs: true,
	exportData: true,
	importData: true,
	keepRecords: false,
	multiCheckbox: true,
	search: '',
	fieldName: null,
	fieldValue: null,
	sortField: '',
	sortDir: '',
	pageNo: 1,
	limit: 10,
}
export default ReclamationListPage;