import React, { Component } from 'react'
import './sf_tf.sidenav.scss'
import { connect } from 'react-redux'
import {FormThumbnail, List, Preloader, Textbox} from "../../_components/COMMON";
import {
    ActiveForm, LoadedForms, LoadForm, LoadWorkspaces, PreloadWorkspaces,
    SelectedWorkspace
} from "../../core/actions";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { KEY } from "../../core/services";
import Wrap from "../../_components/COMMON/Wrap/_wrap";
import {DockService} from "../../core/services/dock.service";

class Sidenav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'sidenav_expanded' : false,
            workspaces : [{
                "formgroup_name" : "Workspace 1",
                "formgroup_description" : "This is a test formgroup created in a json file locally for testing purposes",
                "selected" : false,
                "forms" : [{
                    form_name : "Form 1",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform1",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    form_name : "Form 2",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform2",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    divider_name : "Financial",
                    type : 'divider',
                }, {
                    form_name : "Form 3",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform3",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }]
            }, {
                "formgroup_name" : "Workspace 2",
                "formgroup_description" : "This is a test formgroup created in a json file locally for testing purposes",
                "selected" : false,
                "forms" : [{
                    form_name : "Form 4",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform4",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    form_name : "Form 5",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform5",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    form_name : "Form 6",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform6",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }]
            }, {
                "formgroup_name" : "Workspace 3",
                "formgroup_description" : "This is a test formgroup created in a json file locally for testing purposes",
                "selected" : false,
                "forms" : [{
                    form_name : "Form 7",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform7",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    form_name : "Form 8",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform8",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }, {
                    form_name : "Form 9",
                    type : 'form',
                    form_description : "This is a test form created in a json file locally for testing purposes",
                    form_id : "typeform9",
                    form_url : "https://kasun7.typeform.com/to/rLxUdm"
                }]
            }]
        };
        this.forms = [
            {
                name: '1',
                url: 'https://kasun7.typeform.com/to/rLxUdm'
            }
        ];
    };

    componentDidMount() {
        this.props.dispatch(PreloadWorkspaces(true));
        DockService.getAllWorkspaces()
            .then(workspaces => {
                // debugger
                this.props.dispatch(PreloadWorkspaces(false));
                const ws_withurl = workspaces.data.Result;
                ws_withurl.map(ws => {
                   ws.structure.map(wss => {
                       wss.Forms.map((wssf,i) => {
                           if(i/2 == 0){
                               wssf.Link = "https://kasun7.typeform.com/to/WHsynh";
                           } else {
                               wssf.Link = "https://kasun7.typeform.com/to/rLxUdm";
                           }
                       });
                   });
                });
                this.props.dispatch(LoadWorkspaces(ws_withurl));
            })
            .catch(error => {
                debugger
            });
    }

    loadForm = (e, form) => {
        // debugger
        this.props.dispatch(LoadForm(form));
    };

    expandSidenav = (e) => {
        const toexpanded = this.state.sidenav_expanded;
        this.setState(state => ({
            ...state,
            'sidenav_expanded' : toexpanded ? false : true
        }));
    };

    selectWorkspace = (e, workspace) => {
        let fgs = [...this.props.form.workspaces];
        fgs.map(g => {
            g.dock_name === workspace.dock_name
            ?   g.selected = true
            :   g.selected = false
        });
        this.props.dispatch(SelectedWorkspace(workspace));
        this.setState(state => ({
            ...state,
            'workspaces' : fgs,
            'sidenav_expanded' : true
        }));
    };

    selectForm = (e, form) => {
        let fgs = [...this.props.form.loaded_forms];
        let alreary_loaded = false;
        if (fgs.length) {
            debugger
            fgs.map(g => {
                if (g.form_name === form.form_name) {
                    // g.selected = true;
                    // const i = fgs.indexOf(g);
                    alreary_loaded = true;
                } else {
                    // g.selected = false;
                }
            });
        } else {
            this.props.dispatch(ActiveForm(form, 0));
        }
        if(!alreary_loaded) fgs.push(form);
        this.props.dispatch(ActiveForm(form, null));
        this.props.dispatch(LoadedForms(fgs));
    };

    goBackToWorkspaces = () => {
        this.props.dispatch(SelectedWorkspace(null));
        this.setState(state => ({
            ...state,
            'sidenav_expanded' : false
        }));
    };

    render() {
        return (
            <div className={`sf-tf-sidenav${ this.state.sidenav_expanded ? ' sf-sidenav-expanded' : '' }`}>
                <span className={`sf-icon-toggle sf-icon icon-sf_ico_${ this.state.sidenav_expanded ? 'chevron_left' : 'chevron_right' }`} onClick={ (e) => this.expandSidenav(e) }></span>
                <div className="sf-sidenav-workspaces">
                    {
                        this.props.uihelper._preload_workspaces_
                        ?   <Preloader type={'SHELL:SIDENAV'}/>
                        :   <Wrap>
                                {
                                    this.props.form.workspaces.map(workspace =>
                                        <div key={KEY()} className={`sf-sidenav-app${workspace.selected ? ' sf-sidenav-app-selected' : ''}`} onClick={ (e) => this.selectWorkspace(e, workspace) }>
                                            <div className={`sf-sidenav-app-prefix${ workspace.selected ? ' sf-sap-selected' : ''}`}>
                                                { workspace.dock_name.substring(0, 2) }
                                            </div>
                                            <div className={`sf-sidenav-app-title${!this.state.sidenav_expanded ? ' sf-sa-title-hidden' : ''}`}></div>
                                        </div>
                                    )
                                }
                            </Wrap>
                    }
                </div>
                <div className="sf-sidenav-workspace-content">
                    <PerfectScrollbar>
                        {
                            this.state.sidenav_expanded && this.props.form.selected_workspace
                            ?   <div className={`sf-sidenav-app-content${!this.state.sidenav_expanded ? ' sf-sa-content-hidden' : ''}`}>
                                    {/*<div className="sf-flexbox-row">*/}
                                        {/*<button onClick={(e) => this.goBackToWorkspaces(e) } className="sf-button sf-button-small sf-button-iconed sf-button-circle"><span className="sf-icon icon-sf_ico_chevron_left"></span></button>*/}
                                        {/*<div className="sf-sidenav-app">*/}
                                            {/*<div className="sf-sidenav-app-prefix sf-sap-selected">*/}
                                                {/*{ this.props.form.selected_workspace.formgroup_name.substring(0, 2) }*/}
                                            {/*</div>*/}
                                            {/*<div className={`sf-sidenav-app-title${!this.state.sidenav_expanded ? ' sf-sa-title-hidden' : ''}`}>{ this.props.form.selected_workspace.formgroup_name }</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    <h3 className="sf-sidenav-app-name">{ this.props.form.selected_workspace.dock_name }</h3>
                                    <div className="sf-sidenav-app-children">
                                        <List>
                                            {
                                                this.props.form.selected_workspace.structure.map(div =>
                                                    <Wrap key={KEY()}>
                                                        <li key={KEY()} className="sf-formlist-divider">{div.Div}</li>
                                                        {
                                                            div.Forms.map(form =>
                                                                <li key={KEY()} onClick={(e)=>this.selectForm(e, form)} className={`${form.active ? 'sf-list-active' : null}`}>
                                                                    <Textbox icon={form.type !== 'divider' ? 'code' : ''} size="17">
                                                                        <span>{ form.type === 'divider' ? form.divider_name : form.form_name }</span>
                                                                    </Textbox>
                                                                </li>
                                                            )
                                                        }
                                                    </Wrap>
                                                )
                                            }
                                        </List>
                                        {/*<ul className="sf-sac-list">*/}
                                            {/*{*/}
                                                {/*this.props.form.selected_workspace.forms.map(form =>*/}
                                                    {/*<li key={KEY()}>{ form.form_name }</li>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</ul>*/}
                                    </div>
                                </div>
                            :   null
                        }
                        {/*{*/}
                        {/*this.forms.map(form =>*/}
                        {/*<div onClick={ (e) => this.loadForm(e, form.url) } style={{'padding': '5px'}}>*/}
                        {/*<FormThumbnail key={KEY()} title={form.name}></FormThumbnail>*/}
                        {/*</div>*/}
                        {/*)*/}
                        {/*}*/}
                    </PerfectScrollbar>
                </div>
            </div>
        )
    };

}

const mapStateToProps = state => ({
    form: state.form,
    uihelper: state.uihelper,

});
export default connect(mapStateToProps) (Sidenav);