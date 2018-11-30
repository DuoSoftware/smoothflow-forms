import React from 'react'
import './sf_tf.topbar.scss'

const TopBar = (props) =>
    <div className="sf-tf-topbar">
        <div className="sf-tf-topbar-brand">
            <div className="sf-tf-topbar-logo">
                <img src="https://smoothflow.io/images/logo-smoothflow-beta-purple.svg" alt=""/> <span className="sf-tf-topbar-logo-text">Forms</span>
            </div>
        </div>
        <div className="sf-tf-topbar-tools">
            <div className="sf-tf-topbar-tool"></div>
            <span className="sf-tf-topbar-username">Hello!</span>
        </div>
    </div>

export default TopBar;