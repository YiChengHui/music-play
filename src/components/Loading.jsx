import { Component } from "react";
import { Spin } from 'antd';

export class Loading extends Component {
    render() {
        const className = this.props.Loading ? "loading show" : "loading hide";
        return (
            <div className={className}>
                <Spin className="spin" tip={"加载中"} size="large" />
            </div>
        )
    }
}