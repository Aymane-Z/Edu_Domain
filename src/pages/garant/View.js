import { $t } from 'hooks/i18n';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import GarantEditPage from 'pages/garant/Edit';
import useApp from 'hooks/useApp';
import useAuth from 'hooks/useAuth';
import useUtils from 'hooks/useUtils';

import useViewPage from 'hooks/useViewPage';
import MasterDetailPages from './MasterDetailPages';
const GarantViewPage = (props) => {
		const auth = useAuth();
	const app = useApp();
	const utils = useUtils();
	const pageController = useViewPage(props);
	const { item, currentRecord, pageReady, loading, apiRequestError, deleteItem, moveToNextRecord, moveToPreviousRecord } = pageController;
	const pageExportFormats =  [
		'pdf'
	];
	function ActionButton(data){
		const items = [
		{
			label: $t('edit'),
			command: (event) => { app.openPageDialog(<GarantEditPage isSubPage apiPath={`/garant/edit/${data.id}`} />, {closeBtn: true }) },
			icon: "pi pi-pencil",
			visible: () => auth.canView('garant/edit')
		},
		{
			label: $t('delete'),
			command: (event) => { deleteItem(data.id) },
			icon: "pi pi-trash",
			visible: () => auth.canView('garant/delete')
		}
	]
	.filter((item) => {
		if(item.visible){
			return item.visible()
		}
		return true;
	});
		return (<Menubar className="p-0 " model={items} />);
	}
	function PageFooter() {
		if (props.showFooter) {
			return (
				<div className="flex justify-content-between">
					{props.exportButton && <Button icon="pi pi-print" className="mx-xs" title={$t('export')} /> }
	<div className="flex justify-content-start">
	{ActionButton(item)}
	</div>
	<div className="flex align-items-center justify-content-center py-3">
		<div className="mx-1">
			<Button disabled={!item.previousRecordId} onClick={()=>moveToPreviousRecord()} icon="pi pi-arrow-left"   />
		</div>
		<div className="mx-1">
			<Button disabled={!item.nextRecordId} onClick={()=>moveToNextRecord()} icon-pos="right" icon="pi pi-arrow-right"  />
		</div>
	</div>
				</div>
			);
		}
	}
	if(loading){
		return (
			<div className="p-3 text-center">
				<ProgressSpinner style={{width:'50px', height:'50px'}} />
			</div>
		);
	}
	if(apiRequestError){
		return (
			<PageRequestError error={apiRequestError} />
		);
	}
	if(pageReady){
		return (
			<div>
<main id="GarantViewPage" className="main-page">
    { (props.showHeader) && 
    <section className="page-section mb-3" >
        <div className="container">
            <div className="grid justify-content-between align-items-center">
                { !props.isSubPage && 
                <div className="col-fixed " >
                    <Button onClick={() => app.navigate(-1)} label={$t('')}  className="p-button p-button-text " icon="pi pi-arrow-left"  />
                </div>
                }
                <div className="col " >
                    <Title title={$t('garantDetails')}   titleClass="text-2xl text-primary font-bold" subTitleClass="text-500"      separator={false} />
                </div>
            </div>
        </div>
    </section>
    }
    <section className="page-section " >
        <div className="container">
            <div className="grid ">
                <div className="col comp-grid" >
                    <div >
                        <div className="grid ">
                            <div className="col">
                                {/*PageComponentStart*/}
                                <div className="mb-3 grid ">
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('code')}</div>
                                                <div className="font-bold">{ item.code }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('denomination')}</div>
                                                <div className="font-bold">{ item.denomination }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('gerant')}</div>
                                                <div className="font-bold">{ item.gerant }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('nCin')}</div>
                                                <div className="font-bold">{ item.cin }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('adresse')}</div>
                                                <div className="font-bold">{ item.adresse }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('rc')}</div>
                                                <div className="font-bold">{ item.rc }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('patente')}</div>
                                                <div className="font-bold">{ item.patente }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('tlphone1')}</div>
                                                <div className="font-bold">{ item.tel1 }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('tlphone2')}</div>
                                                <div className="font-bold">{ item.tel2 }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('tlphone3')}</div>
                                                <div className="font-bold">{ item.tel3 }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('email')}</div>
                                                <div className="font-bold">{ item.mail }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('compteBancaire')}</div>
                                                <div className="font-bold">{ item.compte_bancaire }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('profession')}</div>
                                                <div className="font-bold">{ item.profession }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('revenusMensuels')}</div>
                                                <div className="font-bold">{ item.revenus_mensuels }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('dateCreated')}</div>
                                                <div className="font-bold">{item.date_created && <Button className="p-0 p-button-plain p-button-text" label={utils.relativeDate(item.date_created)} tooltip={utils.humanDatetime(item.date_created)} />}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4">
                                        <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100 ">
                                            <div className="">
                                                <div className="text-400 font-medium mb-1">{$t('dateUpdated')}</div>
                                                <div className="font-bold">{item.date_updated && <Button className="p-0 p-button-plain p-button-text" label={utils.relativeDate(item.date_updated)} tooltip={utils.humanDatetime(item.date_updated)} />}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*PageComponentEnd*/}
                            </div>
                            {
                            (currentRecord && !props.isSubPage) && 
                            <div className="col-12">
                                <div className="card my-3 p-1">
                                    <MasterDetailPages masterRecord={currentRecord} scrollIntoView={false} />
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
				<PageFooter />
			</div>
		);
	}
}
GarantViewPage.defaultProps = {
	id: null,
	primaryKey: 'id',
	pageName: 'garant',
	apiPath: 'garant/view',
	routeName: 'garantview',
	msgBeforeDelete: $t('tesVousSrDeVouloirSupprimerCetEnregistrement'),
	msgTitle: $t('deleteRecord'),
	msgAfterDelete: $t('enregistrementSupprimAvecSuccs'),
	showHeader: true,
	showFooter: true,
	exportButton: true,
	isSubPage: false,
}
export default GarantViewPage;
