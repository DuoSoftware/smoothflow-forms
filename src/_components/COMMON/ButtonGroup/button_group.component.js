import React, { Component } from 'react';
import './button_group.scss';

const ButtonGroup = (props) => {
    return <div className="sf-buttongroup">
                { props.children }
           </div>
};

export { ButtonGroup };