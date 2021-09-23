import { Component } from "react";
import { Menu, List, Avatar, Row, Col } from 'antd';
import { api } from "../api/index";

const { SubMenu } = Menu;
const user = localStorage.getItem("userData");
const userData = user ? JSON.parse(user) : {};

export class Index extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        userData,
        playlist: [],
        songs: []
    }
    componentDidMount() {
        const check = userData?.account?.id || null;
        check && this.getPlaylist();
    }
    async getPlaylist() {
        const uid = userData?.account?.id;
        const { data: { playlist } } = await api.get(`/user/playlist?uid=${uid}`);
        this.setState({
            playlist,
        });
        const [{ id }] = playlist;
        this.getListDetail(id);
    }

    async getListDetail(id) {
        const { data: { privileges } } = await api.get(`/playlist/detail?id=${id}`);
        let ids = "";
        privileges.forEach(({ id }) => ids += `${id},`)
        const { data: { songs } } = await api.get(`/song/detail?ids=${ids.slice(0, -1)}`);
        this.setState({
            songs,
        });
        console.log(songs);
    }

    render() {
        return (
            <Row gutter={20}>
                <Col span={5}>
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['menu1']}
                        mode="inline"
                    >
                        <SubMenu key="menu1" title="创建的歌单">
                            <Menu.ItemGroup >
                                {this.state.playlist.map((item, index) => <Menu.Item key={index + 1}>{item.name}</Menu.Item>)}
                            </Menu.ItemGroup>
                        </SubMenu>
                    </Menu>
                </Col>
                <Col span={19}>
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.songs}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.al.picUrl} />}
                                    title={item.name}
                                    description={item.ar.map(item => item.name)}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        )
    }
}