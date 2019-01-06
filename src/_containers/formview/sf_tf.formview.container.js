import React from 'react'
import { connect } from 'react-redux'

const Formview = props =>
    <div className="sf-tf-formview">
        <iframe id="typeform-full" width="100%" height="100%" frameBorder="0" src={ props.form }></iframe>
        <script type={'text/javascript'} src={'https://embed.typeform.com/embed.js'}></script>
    </div>

// const mapStateToProps = state => ({
//     // form: state.form
// });

export default Formview;