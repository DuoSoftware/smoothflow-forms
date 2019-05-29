import React, { Component } from 'react'
import './comment.scss'

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="sf-comment">
                <div className="sf-image-box">
                    <div className="sf-comment-user">{this.props.comment.name.substring(0, 1)}</div>
                    <h4>{this.props.comment.name}</h4>
                    <small>{this.props.comment.time}</small>
                </div>
                <div className="sf-comment-body">
                    <p>{this.props.comment.comment}</p>
                </div>
            </div>
        )
    }
}

export default Comment;