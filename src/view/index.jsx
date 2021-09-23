import { Component } from "react";
import { api } from "../api/index";

export class Index extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        // this.getSongs();
    }
    async getSongs() {
        const { data } = await api.get(`/top/playlist/highquality`)
        console.log(data);
    }
    render() {
        return (
            <div>首页</div>
        )
    }
}