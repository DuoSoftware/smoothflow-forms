import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {Button} from "../COMMON";
import * as $ from 'jquery';
import { connect } from 'react-redux'
import {ActiveForm} from "../../core/actions";
import {createStore} from "redux";
import rootReducer from "../../core/reducers";
import IoTClient from "../../core/lib/iot-client";

const store = createStore(rootReducer);

class Tabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTabIndex: this.props.defaultActiveTabIndex
        };
        this.handleTabClick = this.handleTabClick.bind(this);
        this.resetScrollButtons = this.resetScrollButtons.bind(this);
    }

    componentDidMount() {
        this.resetScrollButtons('init');
        // const _self = this;
        $("#sf-tabnav-left").click(function () {
            const leftPos = $('#sf-tabs-slider').scrollLeft();
            $("#sf-tabs-slider").animate({scrollLeft: leftPos - 90}, 300, function () {
                const left = $('#sf-tabs-slider').scrollLeft();
                if(left === 0){
                    debugger
                    // this.resetScrollButtons('left');
                } else {
                    // this.resetScrollButtons(null)
                }
            });
        });

        $("#sf-tabnav-right").click(function () {
            // const _self = this;
            const leftPos = $('#sf-tabs-slider').scrollLeft();
            $("#sf-tabs-slider").animate({scrollLeft: leftPos + 90}, 300, function () {
                const right = $(document).outerWidth() - $(window).width();
                if(right === 0){
                    debugger
                    // this.resetScrollButtons('right');
                } else {
                    // this.resetScrollButtons(null)
                }
            });
        });
    };

    componentDidUpdate() {
        const form = this.props.form.active_form;
        const i = this.props.form.loaded_forms.indexOf(form);
        debugger
        if(this.state.activeTabIndex !== i) {
            // debugger
            this.handleTabClick(i);
        }
    }

    // Toggle currently active tab
    handleTabClick(tabIndex) {
        this.setState({
            activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
        });
        const forms = this.props.form.loaded_forms;
        const form = forms[tabIndex];
        this.props.dispatch(ActiveForm(form, null));

        if (form.type === "Dropdown") {
            this.lockTask(form);
        }
    }

    iotClient = new IoTClient(this.props.notifications.tokens);
    lockTask(form) {
        debugger
        this.iotClient.onConnect(function () {
            debugger
            const id = form.Link.split('/').pop();
            this.iotClient.subscribe('tasks');
            const data = {
                "topic": "tasks",
                "data": {
                    "type" : "task",
                    "status" : "LOCKED",
                    "name" : form.form_name,
                    "id" : id
                }
            };
            this.iotClient.publish('tasks', JSON.stringify(data));
        });
        this.iotClient.onConnectionError(function () {
            // debugger;
        });
    };

    // Encapsulate <Tabs/> component API as props for <Tab/> children
    renderChildrenWithTabsApiAsProps() {
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                onClick : this.handleTabClick,
                tabIndex: index,
                isActive: index === this.state.activeTabIndex
            });
        });
    }

    // Render current active tab content
    renderActiveTabContent() {
        const {children} = this.props;
        const {activeTabIndex} = this.state;
        if(children[activeTabIndex]) {
            return children[activeTabIndex].props.children;
        }
    }

    resetScrollButtons(pos)  {
        const left = $('#sf-tabs-slider').scrollLeft();

        if (pos) {
            if (pos === 'init') {
                left === 0 ? $(".sf-tabs-scroll-left").addClass('sf-tab-scroll-end') : $(".sf-tabs-scroll-left").removeClass('sf-tab-scroll-end');
            }
            if (pos === 'left') {
                $(".sf-tabs-scroll-left").addClass('sf-tab-scroll-end');
                $(".sf-tabs-scroll-right").removeClass('sf-tab-scroll-end');
            } else if (pos === 'right') {
                $(".sf-tabs-scroll-right").addClass('sf-tab-scroll-end');
                $(".sf-tabs-scroll-left").removeClass('sf-tab-scroll-end');
            }
        }
    }

    render() {
        return (
            <div className="sf-tabs">
                <ul className="sf-tabs-nav">
                    <li className="sf-tabs-scroll-left">
                        <Button id="sf-tabnav-left" className="sf-button sf-button-primary sf-button-primary-light sf-button-iconed sf-button-circle">
                            <span className="sf-icon icon-sf_ico_chevron_left"></span>
                        </Button>
                    </li>
                    <div id="sf-tabs-slider">
                        { this.renderChildrenWithTabsApiAsProps() }
                    </div>
                    <li className="sf-tabs-scroll-right">
                        <Button id="sf-tabnav-right" className="sf-button sf-button-primary-light sf-button-iconed sf-button-circle">
                            <span className="sf-icon icon-sf_ico_chevron_right"></span>
                        </Button>
                    </li>
                </ul>
                <div className="sf-tab-body">
                    { this.renderActiveTabContent() }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    form: state.form,
    notifications: state.notifications
});

export default ( connect(mapStateToProps) )(Tabs);