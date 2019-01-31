import React from 'react'
import { connect } from 'react-redux'

const Formview = props =>
    <div className={`sf-tf-formview ${props.className}`} id={props.id}>
        <iframe id="typeform-full" width="100%" height="100%" frameBorder="0" src={ props.form }></iframe>
        <script type={'text/javascript'} src={'https://embed.typeform.com/embed.js'}></script>
    </div>

export default Formview;