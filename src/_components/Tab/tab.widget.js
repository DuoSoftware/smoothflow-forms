import React, { Component } from 'react';
import './tabs.scss';
import { connect } from 'react-redux'
import {LoadedForms, RemoveLoadedForm} from "../../core/actions";

class Tab extends Component {
    closeTab = (e, tab) => {
        let loaded_tabs = [...this.props.form.loaded_forms];
        // loaded_tabs.splice(tab, 1);
        this.props.dispatch(RemoveLoadedForm(loaded_tabs, tab));
    };

    render() {
        return (
            <li className={`sf-tab ${this.props.isActive ? 'active' : ''}`}>
                <a onClick={(event) => {
                       event.preventDefault();
                       this.props.onClick(this.props.tabIndex);
                   }}>
                    { this.props.title }
                </a>
                <span className="sf-tab-active-arrow"></span>
                <span className="sf-tab-close sf-icon icon-sf_ico_close_circle" onClick={(e)=>this.closeTab(e, this.props.tabIndex)}></span>
            </li>
        )
    }
}

const mapStateToProps = state => ({
    form: state.form
});

export default (connect(mapStateToProps))(Tab);