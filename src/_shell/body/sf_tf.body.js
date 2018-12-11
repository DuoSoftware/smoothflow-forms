import React from 'react'
import './sf_tf.body.scss'
import {ButtonGroup} from "../../_components/COMMON";
import Tabs from "../../_components/Tab/tabs.widget";
import Tab from "../../_components/Tab/tab.widget";

const Body = props =>
    <div className="sf-tf-body">
        { props.children }
    </div>

export default Body;