import React from 'react'
import './textbox.scss'

const Textbox = (props) => {
    return (
        <div className={`sf-textbox${props.center ? ' sf-textbox-center' : ''}`} { ...props }>
            {
                props.icon
                ?   props.font
                    ? <span className={`sf-textbox-icon sf-icon icon-sf_ico_${props.icon}`} style={{ fontSize: props.size+'px'}}></span>
                    : <i className="material-icons sf-textbox-icon" style={{ fontSize: props.size+'px'}}>{props.icon}</i>
                :
                props.image
                ?   <img className="sf-textbox-image" src={props.image} style={{ width: props.size+'px'}} />
                :   null
            }
            <div className="sf-textbox-text">{props.children}</div>
        </div>
    )
};

export { Textbox }