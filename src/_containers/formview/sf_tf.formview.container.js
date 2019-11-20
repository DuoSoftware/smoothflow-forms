import React from 'react'
import { connect } from 'react-redux'
import Wrap from "../../_components/COMMON/Wrap/_wrap";

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

const Formview = props => 
<div className={`sf-tf-formview ${props.className} ${props.type === 'app' ? ' sf-tf-appview' : ''}`} id={props.id}>
{
    
    // props.type === 'form'
        //?

        (validURL(props.form))
        ?
       <Wrap> 
            <iframe id="typeform-full" width="100%" height="100%" frameBorder="0" src ={props.form}></iframe>
            <script type={'text/javascript'} src={'https://embed.typeform.com/embed.js'} ></script>
        </Wrap>

        :
        <Wrap>No content available</Wrap>

        // :
    // props.type === 'app'
    //     ?   null
    //     :   <iframe id="app" width="100%" height="100%" frameBorder="0" src={ props.form }></iframe>
}
</div>


export default Formview;