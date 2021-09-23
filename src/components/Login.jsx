import { Component } from "react";
import { Form, Input, Button, Checkbox, message, Modal, Tabs, Spin } from 'antd';
import { api } from "../api/index";
const { TabPane } = Tabs;
let timer = null; //定时器变量
export class Login extends Component {
    state = {
        loading: false,
        qrImg: null,
        qrUnikey: null,
    }

    async onFinish(value) {
        this.setState({
            loading: true
        });
        const { data } = await api.get(`/login/cellphone`, {
            params: { ...value }
        });
        const { error, success } = message;
        if (data.code === "502") {
            error(data.msg)
        } else {
            this.props.LoginSuccess(data);
            success("登录成功!");
            this.setState({
                loading: false
            });
        }
    }


    //获取登录二维码
    async getQrCode() {
        const { data: { data: { code, unikey } } } = await api.get(`/login/qr/key`, {
            params: {
                t: Date.now(),
            },
            loading: false
        });

        if (code === 200) {
            this.setState({
                qrUnikey: unikey,
            });
            const { data: { data } } = await api.get(`/login/qr/create`, {
                params: {
                    qrimg: true,
                    key: unikey,
                    t: Date.now()
                },
                loading: false,
            });
            if (data && data.qrimg) {
                this.setState({
                    qrImg: data.qrimg
                });
                this.checkCrCode()
            };
        }
    }

    //轮询获取二维码状态是否失效
    async checkCrCode() {
        const { data: { code } } = await api.get(`/login/qr/check`, {
            params: {
                key: this.state.qrUnikey
            },
            loading: false
        });
        code === 801 && this.checkCrCode();
    }


    tabChange(key) {
        if (key === "2") {
            if (this.state.qrUnikey) {
                this.checkCrCode();
            } else {
                clearInterval(timer);
                this.getQrCode();
            }
        }
    }


    render() {
        return (
            <Modal
                visible={this.props.visible}
                footer={null}
            >
                <Tabs defaultActiveKey="1" onChange={this.tabChange.bind(this)}>
                    <TabPane tab="手机号登录" key="1">
                        <Form
                            name="basic"

                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={this.onFinish.bind(this)}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="手机号码"
                                name="phone"
                                rules={[{
                                    required: true,
                                    message: '请输入你的手机号码!',
                                }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的密码!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Checkbox>记住我</Checkbox>
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit" loading={this.state.loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="扫码登录" disabled key="2" style={{ textAlign: "center" }}>
                        {
                            this.state.qrImg ? <img src={this.state.qrImg} alt="扫码登录" /> : <Spin className="spin" tip={"加载中"} size="large" />
                        }
                    </TabPane>
                </Tabs>
            </Modal>);
    }
}