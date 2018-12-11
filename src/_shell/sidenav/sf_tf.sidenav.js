import React, { Component } from 'react'
import './sf_tf.sidenav.scss'
import { connect } from 'react-redux'
import { FormThumbnail } from "../../_components/COMMON";
import {LoadForm} from "../../core/actions";
import PerfectScrollbar from 'react-perfect-scrollbar';
import {KEY} from "../../core/services";

class Sidenav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'sidenav_expanded' : false
        };
        this.forms = [
            {
                name: '1',
                url: 'https://kasun7.typeform.com/to/rLxUdm'
            }
        ];
    };

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

    render() {
        return (
            <div className={`sf-tf-sidenav${ this.state.sidenav_expanded ? ' sf-sidenav-expanded' : '' }`}>
                <span className={`sf-icon-toggle sf-icon icon-sf_ico_${ this.state.sidenav_expanded ? 'chevron_left' : 'chevron_right' }`} onClick={ (e) => this.expandSidenav(e) }></span>
                <PerfectScrollbar>
                    {
                        this.forms.map(form =>
                            <div onClick={ (e) => this.loadForm(e, form.url) } style={{'padding': '5px'}}>
                                <FormThumbnail key={KEY()} title={form.name}></FormThumbnail>
                            </div>
                        )
                    }
                </PerfectScrollbar>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    form: state.form
});
export default connect(mapStateToProps) (Sidenav);