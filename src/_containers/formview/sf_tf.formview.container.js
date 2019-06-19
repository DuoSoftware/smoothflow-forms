import React from 'react'
import { connect } from 'react-redux'
import Wrap from "../../_components/COMMON/Wrap/_wrap";

const Formview = props =>
    <div className={`sf-tf-formview ${props.className} ${props.type === 'app' ? ' sf-tf-appview' : ''}`} id={props.id}>
        {
            // props.type === 'form'
                //?
              <Wrap>
                <iframe id="typeform-full" width="100%" height="100%" frameBorder="0" src={ props.form }></iframe>
                <script type={'text/javascript'} src={'https://embed.typeform.com/embed.js'}></script>
              </Wrap>
                // :
            // props.type === 'app'
            //     ?   null
            //     :   <iframe id="app" width="100%" height="100%" frameBorder="0" src={ props.form }></iframe>
        }
    </div>

export default Formview;