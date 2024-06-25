import { $t } from 'hooks/i18n';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ExportPageData } from 'components/ExportPageData';
import { FilterTags } from 'components/FilterTags';
import { InputText } from 'primereact/inputtext';
import { PageRequestError } from 'components/PageRequestError';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useUtils from 'hooks/useUtils';

import useListPage from 'hooks/useListPage';
const PavillondetailsListPage = (props) => {
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
	const { records, pageReady, loading, apiUrl, sortBy, sortOrder, apiRequestError, getPageBreadCrumbs, onSort, pagination } = pageController;
	const { filters, setFilterValue } = filterController;
	const { totalRecords, totalPages, recordsPosition, firstRow, currentPage, limit, onPageChange } =  pagination;
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
	function ExportData() {
		if (props.exportData && records.length) {
			const downloadFileName = `${utils.dateNow()}-pavillondetails`;
			return (
				<div className="m-2">
					<ExportPageData  pageUrl={apiUrl} downloadFileName={downloadFileName} butonLabel={$t('exporter')} tooltip={$t('export')} buttonIcon="pi pi-print" />
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
	function PageActionButtons() {
		return (
			<div className="flex flex-wrap">
				<ExportData />
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
	return (
<main id="PavillondetailsListPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container-fluid">
            <div className="grid justify-content-between align-items-center">
                <div className="col " >
                    <Title title={$t('pavillondetails')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
                <div className="col-12 md:col-3 " >
                    <span className="p-input-icon-left w-full">
                    <i className="pi pi-search" />
                    <InputText placeholder={$t('search')} className="w-full" value={filters.search.value}  onChange={(e) => setFilterValue('search', e.target.value)} />
                    </span>
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
                                <Column  field="id" header={$t('id')}  sortable={true} ></Column>
                                <Column  field="code" header={$t('code')}  sortable={true} ></Column>
                                <Column  field="type" header={$t('type')}  sortable={true} ></Column>
                                <Column  field="denomination" header={$t('denomination')}  sortable={true} ></Column>
                                <Column  field="description" header={$t('description')}  sortable={true} ></Column>
                                <Column  field="nombre_niveaux" header={$t('nombreNiveaux')}  sortable={true} ></Column>
                                <Column  field="nombre_entrees" header={$t('nombreEntrees')}  sortable={true} ></Column>
                                <Column  field="dt_mise_service" header={$t('dtMiseService')}  sortable={true} ></Column>
                                <Column  field="id_batiment" header={$t('idBatiment')}  sortable={true} ></Column>
                                <Column  field="b_denomination" header={$t('bDenomination')}  sortable={true} ></Column>
                                <Column  field="id_residence" header={$t('idResidence')}  sortable={true} ></Column>
                                <Column  field="r_denomination" header={$t('rDenomination')}  sortable={true} ></Column>
                                <Column  field="id_responsable" header={$t('idResponsable')}  sortable={true} ></Column>
                                <Column  field="id_proprietaire" header={$t('idProprietaire')}  sortable={true} ></Column>
                                <Column  field="p_denomination" header={$t('pDenomination')}  sortable={true} ></Column>
                                <Column  field="nom_prenom" header={$t('nomPrenom')}  sortable={true} ></Column>
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
PavillondetailsListPage.defaultProps = {
	primaryKey: '',
	pageName: 'pavillondetails',
	apiPath: 'pavillondetails/index',
	routeName: 'pavillondetailslist',
	msgBeforeDelete: $t('tesVousSrDeVouloirSupprimerCetEnregistrement'),
	msgTitle: $t('deleteRecord'),
	msgAfterDelete: $t('enregistrementSupprimAvecSuccs'),
	showHeader: true,
	showFooter: true,
	paginate: true,
	isSubPage: false,
	showBreadcrumbs: true,
	exportData: true,
	importData: false,
	keepRecords: false,
	multiCheckbox: false,
	search: '',
	fieldName: null,
	fieldValue: null,
	sortField: '',
	sortDir: '',
	pageNo: 1,
	limit: 10,
}
export default PavillondetailsListPage;
