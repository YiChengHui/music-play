import axios from "axios";
import { bus } from "../Bus";
import { Spin } from 'antd';
Spin.setDefaultIndicator()

export const api = axios.create({
    baseURL: "/api/"
});

api.interceptors.request.use(config => {
    let loading = typeof config.loading === "boolean" ? config.loading : true;
    if (loading) {
        bus.$emit("request", {
            type: true
        });
    }
    return config
});

api.interceptors.response.use(config => {
    let loading = typeof config.loading === "boolean" ? config.loading : true;
    if (loading) {
        bus.$emit("request", {
            type: false
        });
    }
    return config
}, err => {
    bus.$emit("request", {
        type: false,
        err,
    });
    return err
});