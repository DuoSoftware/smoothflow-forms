import React from 'react'
import './sf_tf.sidenav.scss'
import FormThumbnail from "../../_components/COMMON/form/sf_tf.form_thumbnail.component";

const forms = [
    {
        name: '1'
    },{
        name: '2'
    },{
        name: '3'
    }
];

const Sidenav = props =>
    <div className="sf-tf-sidenav">
        {
            forms.map(form =>
                <FormThumbnail title={form.name}></FormThumbnail>
            )
        }
    </div>

export default Sidenav;