import React, { Component } from "react";
import { withRouter, BrowserRouter } from "react-router-dom";
import liff from "@line/liff";
import BannerTop from "./compo-banner";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./custom.css";
import "moment-timezone";
import { data } from "jquery";

class AuthenPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerName: "",
            verifyId: "",
            ownerId: "",
        };
        this.closeApp = this.closeApp.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlerChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    closeApp(event) {
        event.preventDefault();
        liff.sendMessages([{
            type: 'text',
            text: "ยกเลิกการยืนยัน"
        }]).then(() => {
            liff.closeWindow();
        });
    }

    componentDidMount() {
        liff
            .init({ liffId: "1654378227-bePl7PNo" })
            .then(async () => {
                if (!liff.isLoggedIn()) {
                    liff.login();
                }
                // Start to use liff's api
                // const lineProfile = liff.getProfile();
                // console.log(lineProfile);
                // const idToken = liff.getIDToken();
                // console.log(idToken);
                // print raw idToken object
                let userId;
                await liff.getProfile().then((dataInfo) => {
                    userId = dataInfo.userId;
                })
                await axios.get("https://us-central1-antv2-xdbgna.cloudfunctions.net/twaApi/owner")
                    .then(res => {
                        console.log(res.data);
                        res.data.map((owner) => {
                            if (owner.ownerId === userId && owner.verify === true) {
                                this.props.history.push("/successAuth/")
                            }
                        })
                    })

            })
            .catch((err) => {
                // Error happens during initialization
                console.log(err.code, err.message);
                // liff.closeWindow();
            });
        // const profile = liff.getProfile();





    }

    getProfile() {
        liff.getProfile().then((dataInfo) => {
            this.setState({
                ownerId: dataInfo.userId,
            });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        // new Intl.DateTimeFormat("en-GB", {
        //     year: "numeric",
        //     month: "numeric",
        //     day: "2-digit"
        // }).format(this.state.date)
        const data = new FormData(event.target);
        data.append("ownerName", this.state.ownerName);
        data.append("ownerId", this.state.ownerId);
        data.append("verifyId", this.state.verifyId);
        console.log(this.state);
        liff
            .sendMessages([
                {
                    type: "text",
                    text: "ยืนยันตัวตนสำเร็จ",
                },
            ])
            .then(() => {
                console.log("message sent");
            })
            .catch((err) => {
                console.log("error", err);
            });

        axios
            .post("https://us-central1-antv2-xdbgna.cloudfunctions.net/twaApi/owner/verify",
                data,
            )
            .then((response) => {
                console.log("response: ", response.data);
                if (response.data.status == true) {
                    this.props.history.push("/successAuth/")
                } else {
                    alert("รหัสยืนยันตัวตนผิดพลาด");
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }


    render() {
        return (
            <div>
                <BannerTop message="การยืนยันตัวตน" />
                <div className="container mw-25">
                    <form onSubmit={this.handleSubmit} onInput={this.getProfile}>
                        <div className="form-group">
                            <div className="form-group">
                                <div>
                                    <label>ชื่อ นามสกุล</label>
                                </div>
                                <input
                                    required
                                    name="ownerName"
                                    type="text"
                                    onChange={this.handlerChange}
                                />

                            </div>
                            <div type="hidden">
                                <input
                                    required
                                    name="ownerId"
                                    type="hidden"
                                    onLoad
                                    className="form-control"
                                    value={this.state.ownerId}
                                />
                            </div>
                            <div className="form-group">
                                <div>
                                    <label>รหัสยืนยันตัวตน</label>
                                </div>
                                <input
                                    required
                                    name="verifyId"
                                    type="text"
                                    onChange={this.handlerChange}
                                />
                                { }
                            </div>
                            <div>
                                <input type="submit" value="ยืนยัน" />{" "}
                            </div>
                            <div>
                                <input type="button" onClick={liff.closeWindow} value="ปิด" />
                            </div>
                        </div>
                    </form>

                </div>

            </div>
        );
    }

}
export default withRouter(AuthenPage);