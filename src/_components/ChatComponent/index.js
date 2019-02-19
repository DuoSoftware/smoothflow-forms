import React, { Component } from 'react';
import "./index.css";
import openSocket from 'socket.io-client';
import {ChatSend} from "../../core/services";
import { connect } from 'react-redux'
import EmptyConvo from "../COMMON/EmptyConvo/emptyconvo.component";
const socket = openSocket('http://smoothflow.herokuapp.com');

class ChatComponent extends Component {
    constructor() {
        super()
        this.state = {
            input: "",
            chat: [],
        }
    }

    componentDidMount() {
        debugger
        let { id } = this.props._id;
        socket.on(id, (data) => {
            let msgs = this.state.chat;
            this.setState({ chat: [...msgs, data] });
        })
    }

    handleChange = (event) => {
        this.setState({
            input: event.target.value
        })
    };

    chatSubmit = (event) => {
        event.preventDefault();
        if (this.state.input) {
            this.setState({
                loading: true
            });
            // let { match } = this.props;
            // debugger
            // let [app_id, member_id] = match.params.id.split("_:_");
            let obj = {
                message: this.state.input,
                app_id: this.props._id,
                member_id : this.props.user.username
            };
            debugger
            ChatSend(obj)
                .then((data) => {
                    return data.json()
                })
                .then((jsonData) => {
                    let currentData = this.state.chat;
                    this.setState({
                        input: "",
                        chat: [...currentData, jsonData.data.data.roomChat],
                        loading: false
                    })
                })
                .catch((err) => {
                    this.setState({
                        loading: false
                    })
                })
        }
    };

    render() {
        let { match } = this.props;
        return (
            <div className={`chat-component ${this.props.className}`}>

                {/*<div className="intercom-home-screen-header">*/}
                    {/*<div className="main-div-arrow">*/}
                        {/*<img alt="back-icon" onClick={() => this.props.history.push(`/${match.params.id}`)} className="back-icon" src={require("./../../core/assets/images/right-arrow-angle-purple.svg")} />*/}
                    {/*</div>*/}
                    {/*<div className="head-main-div">*/}
                        {/*<h4 className="example-head">Examply</h4>*/}
                        {/*<p className="replies-para">Typically replies in few minutes</p>*/}
                    {/*</div>*/}
                    {/*<div className="img-main-div">*/}
                        {/*<img className="img-chat" alt='img' src={"https://statusandphoto.weebly.com/uploads/6/0/1/5/60158603/8347592_orig.png"} />*/}
                        {/*<img className="img-chat" alt='img' src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRAjvR6CixyhFjeG2yAzXA1EpBiwMSjiZFv67oG4Vw-uT5Iz7s"} />*/}
                        {/*<img className="img-chat" alt='img' src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"} />*/}
                    {/*</div>*/}
                {/*</div>*/}

                <div className="main-card-div">

                    <div className="chatmsg-main-div" >
                        {this.state.chat.length ? this.state.chat.map((chatMessage, index) => {
                            return (
                                <div key={index}>
                                    {chatMessage.type ?
                                        <div className="chatmsg-div" key={index}>
                                            <span className="chatmsg-pararec">{chatMessage.message}</span>
                                        </div>
                                        :
                                        <div className="chatmsg-div" key={index}>
                                            <span className="chatmsg-para">{chatMessage.message}</span>
                                        </div>
                                    }
                                </div>
                            )
                        }) : <EmptyConvo/>}
                    </div>

                    <form className="input-main-div" onSubmit={this.chatSubmit}>
                        <input className="chat-input" placeholder="Write a reply..." value={this.state.input} onChange={this.handleChange} />
                        {/*<img className="input-icons" alt='gif' src={require("../../core/assets/images/gif.png")} />*/}
                        {/*<img className="input-icons" alt='imoji-icon' src={require("../../core/assets/images/happiness.png")} />*/}
                        {/*<img className="input-icons" alt='link-img' src={require("../../core/assets/images/link.png")} />*/}
                        <button type="Submit" className="send-button">
                            {!this.state.loading ?
                                <i className="material-icons">send</i>
                                : <img className="input-icons" alt="loading" src={require("../../core/assets/images/loading.gif")} />}
                        </button>
                    </form>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user
});

export default ( connect(mapStateToProps) )(ChatComponent);