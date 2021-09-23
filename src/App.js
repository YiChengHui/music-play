import { Routers } from "./router";
import { Component } from "react";
import { Layout, Modal, Avatar, Menu, Dropdown } from 'antd';
import { Loading as LoadingComponent } from "./components/Loading";
import { Login } from "./components/Login"
import { api } from "./api/index";
import { bus } from "./Bus";
import "./css/app.css";

const { Header, Content } = Layout;
const user = localStorage.getItem("userData");

export default class App extends Component {
	state = {
		bool: false,
		LoginVisible: false,
		errString: "",
		visible: false,
		userData: user ? JSON.parse(user) : {},
	}

	componentDidMount() {
		bus.$on("request", ({ type, err }) => {
			this.setState({
				bool: type,
				visible: Boolean(err),
				errString: err && err.toString()
			});
		});
		this.state.userData.profile && this.checkStatus();
	}

	async checkStatus() {
		const random = Math.random();
		const { data: { data } } = await api.get(`/login/status?t = ${random}`);
		console.log(data);
	}

	async logout() {
		const random = Math.random();
		const { data: { data } } = await api.get(`/logout?t = ${random}`);
		console.log(data);
	}

	LoginSuccess(data) {
		localStorage.setItem("userData", JSON.stringify(data));
		this.setState({
			LoginVisible: false,
			userData: data
		});
	}

	render() {
		let menus =
			<Menu>
				<Menu.Item key={1}>
					<span>个人资料</span>
				</Menu.Item>
				<Menu.Item key={2}>
					<span onClick={this.logout}>退出登录</span>
				</Menu.Item>
			</Menu>;

		let UserAvatar =
			<div>
				<span className="nickname" onClick={() => { this.setState({ LoginVisible: true }) }}>登录</span>
			</div>;
		if (this.state.userData.profile) {
			UserAvatar =
				<div>
					<Avatar size="large" src={this.state.userData.profile.avatarUrl} />
					<Dropdown overlay={menus}>
						<span className="nickname">{this.state.userData.profile.nickname}</span>
					</Dropdown>,
				</div >
		}

		return (
			<Layout>
				<Header className="header">
					<div className="userHeader">
						{UserAvatar}
					</div>
				</Header>
				<Layout style={{ padding: '0 24px 24px' }}>
					<Content
						style={{
							padding: 24,
							margin: 0,
							minHeight: 280,
						}}
					>
						<LoadingComponent Loading={this.state.bool} />
						<Modal
							title="提示"
							visible={this.state.visible}
							onOk={() => this.setState({ visible: false })}
							onCancel={() => this.setState({ visible: false })}
						>
							<div>{this.state.errString}</div>
						</Modal>
						<Login
							visible={this.state.LoginVisible}
							LoginSuccess={this.LoginSuccess.bind(this)}
						/>
						<Routers />
					</Content>
				</Layout>
			</Layout>
		);
	}
}