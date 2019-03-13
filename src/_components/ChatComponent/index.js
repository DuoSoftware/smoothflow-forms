import React, { Component } from 'react';
import "./index.css";
import openSocket from 'socket.io-client';
import {ChatSend} from "../../core/services";
import { connect } from 'react-redux';
// const socket = openSocket('http://smoothflow.herokuapp.com');

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
        // socket.on(id, (data) => {
        //     let msgs = this.state.chat;
        //     this.setState({ chat: [...msgs, data] });
        // })
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
            // let [app_id, member_id] = match.params.id.split("_:_")
            let obj = {
                message: this.state.input,
                app_id: this.props._id,
                member_id : this.props.user.username
            };
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
    }

    render() {
        let { match } = this.props;
        return (
            <div className="chat-component">

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
                        }) : <div className="sf-empty-convo">
                            <h1>Start a conversation by typing below</h1>
                        </div>}
                    </div>

                    <form className="input-main-div" onSubmit={this.chatSubmit}>
                        {/*<div className="sf-convo-type-selector">*/}
                            {/*<button type="Submit" className="send-button">*/}
                                {/*{!this.state.loading ?*/}
                                    {/*<i className="material-icons">message</i>*/}
                                    {/*: <img className="input-icons" alt="loading" src={require("../../core/assets/images/loading.gif")} />}*/}
                            {/*</button>*/}
                        {/*</div>*/}
                        <input className="chat-input" placeholder="Write a reply..." value={this.state.input} onChange={this.handleChange} />
                        <button type="button" className="sf-button sf-button-circle text-chat-control">
                            {!this.state.loading ?
                                <i className="material-icons">image</i>
                                : <img className="input-icons" alt="loading" src={require("../../core/assets/images/loading.gif")} />}
                        </button>
                        <button type="button" className="sf-button sf-button-circle text-chat-control">
                            {!this.state.loading ?
                                <i className="material-icons">attachment</i>
                                : <img className="input-icons" alt="loading" src={require("../../core/assets/images/loading.gif")} />}
                        </button>
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

export default (connect(mapStateToProps))(ChatComponent);