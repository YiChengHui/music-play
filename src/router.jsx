import { Component } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import { Index } from "./view/index";

export class Routers extends Component {
    List = [{
        path: "/index",
        component: Index
    }];
    render() {
        const RouterList = this.List.map(item => <Route path={item.path} key={item.path} component={item.component} />);

        return (
            <HashRouter>
                <Redirect from="/" to="/index" />
                {RouterList}
            </HashRouter>
        )
    }
}