import React from 'react'
import './sf_tf.form_thumbnail.scss'

const FormThumbnail = props =>
    <div className="sf-tf-form-thumbnail" {...props}>
        { props.title }
    </div>

export { FormThumbnail };