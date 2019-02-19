import React, { Component } from 'react';
import "./index.css"

class StartConvPage extends Component {
  constructor() {
    super()
  }
  
  render() {
    let { match } = this.props
    return (
      <div className="start-conv-page">
        {/*<div className="intercom-home-screen-header">*/}
          {/*/!*<img className="logo" src={require("./../../assets/images/logo.png")} />*!/*/}
          {/*<h3>Hi,</h3>*/}
          {/*<p>We grow up your business by connecnting you to your customers</p>*/}
        {/*</div>*/}

        <div className="main-card-div">
          <div className="card-1">
            <h3 className="start-conv-head">Start a Conversation</h3>
            <p className="start-a-conv-para">The team typically replies in a few hours</p>
            <div className="start-img-conv-div">
              <img className="conv-img" alt='img' src={"https://statusandphoto.weebly.com/uploads/6/0/1/5/60158603/8347592_orig.png"} />
              <img className="conv-img" alt='img' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRAjvR6CixyhFjeG2yAzXA1EpBiwMSjiZFv67oG4Vw-uT5Iz7s"} />
              <img className="conv-img" alt='img' src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"} />
              <img className="conv-img" alt='img' src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"} />
              <img className="conv-img" alt='img' src={"https://www.bigredcloud.com/wp-content/uploads/4-tips-for-taking-professional-profile-pictures.jpg"} />
              <img className="conv-img" alt='img' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpKwDji4mANkqkGncYeD8osJaScTp_SnBSKeUdVpJS3agulaJNUw"} />
            </div>
            <div className="new-conv-btn-div">
              <button onClick={()=> this.props.history.push(`/smoothflow/chat/${match.params.id}`)} className="new-conv-btn">New Converstaion</button>
              <button className="perv-btn">See Previous</button>
            </div>
          </div>

          <div className="card-2">
            <h3 className="start-conv-head">Find an answer quickly</h3>
            <div className="input-div">
             <input placeholder="search for answer" className="input-search-ans" type="text"/>
             <button className="search-btn">></button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default StartConvPage;
