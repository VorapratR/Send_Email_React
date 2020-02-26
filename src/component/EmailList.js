import React, { Component } from "react";
import {Container,Row, Col, Button} from 'react-bootstrap'
import axios from 'axios';
import "./../App.css";
import _ from 'lodash';

const prepareStatMessage =(email,rank)=> {
    let messageBuffer = []
    email.map((c,i)=> {
        messageBuffer = [...messageBuffer, _.pick(c,'email','user_name','reviews_left_to_uprank','user_next_rank_id')]
        return ''
    })
    messageBuffer.map((c,i) => {
        rank.map((ete) =>{
            if (c.user_next_rank_id === ete.id){
                c.user_next_rank_id = ete.name
            }
            return ''
        })
        return ''
    })
    return {
        message: messageBuffer,
        onSunbmit: false,
        status: []
    }
}

class EmailList extends Component  {
    constructor(props){
        super(props)
        this.state = prepareStatMessage(this.props.emailList,this.props.rankList)
    }

    submitMail(){
        let emailMessage = ''
        let bodyMessage = ''
        this.setState({status: []})
        this.setState({onSunbmit: true})
        this.state.status.splice()
        this.state.message.map(async (c,i) => {
            emailMessage = c.email
            bodyMessage = `
                สวัสดีคุณ ${c.user_name}
                อีก ${c.reviews_left_to_uprank} คุณจะได้เป็น ${c.user_next_rank_id}
                ร่วมแบ่งบันรีวิวกับเพื่อนสมาชิกกันนะค่ะ
            `
            let status = await this.postData(emailMessage,bodyMessage)
            this.setState({status: [...this.state.status, status]})
        })
    }

    async postData(email,body) {
        let status = 'กำลังส่ง'
        await axios.post('https://us-central1-frontend-assignment-d6597.cloudfunctions.net/sendMail', {
            email: email,
            subject: 'Wongnai Reviewer',
            body: body
        }).then((response) => {
            console.log('Success:(204) ' + email);
            status = 'ส่งสำเร็จ'
        },(error) => {
            if (error.message === 'Request failed with status code 500') {
                console.log('Failed(500): ' + email);
            } else if (error.message === 'Request failed with status code 204') {
                console.log('Failed(204): ' + email);
            } else {
                console.log(error.message);
            }
            status = 'ส่งล้มเหลว'
        });
        return status;
    }

    closeWindow() {
        window.open("about:blank", "_self");
        window.close();
    }

    viewSubmitButton() {
        let postStatus = {
           success: 0,
           notSuccess: 0
        }
        this.state.status.map((element) => {
            element === 'ส่งสำเร็จ' ? postStatus.success++: postStatus.notSuccess++
            return ''
        })
        if (this.state.message.length === postStatus.success ) {
            return ( <Button variant="success" className="buttonStyle" onClick={()=>this.closeWindow()}><b>ปิด</b></Button> )
        } else if (postStatus.notSuccess !== 0 ) {
            return ( <Button variant="success" className="buttonStyle" onClick={()=>this.submitMail()}><b>ลองส่งเมลล์ที่ส่งล้มเหลวอีกครั้ง</b></Button> ) 
        } else 
            return ( <Button variant="success" className="buttonStyle" onClick={()=>this.submitMail()}><b>ส่งเมล</b></Button> ) 
    }
    viewStatusText(index) {
        if (this.state.status[index] === 'ส่งสำเร็จ') {
            return (<p className="text-success font-face"><b>{this.state.status[index]}</b></p>)
        } else if (this.state.status[index] === 'ส่งล้มเหลว') {
            return (<p className="text-danger font-face"><b>{this.state.status[index]}</b></p>)
        } else if (this.state.status[index] === 'กำลังส่ง' || this.state.onSunbmit) {
            return (<p className="text-primary font-face"><b>{'กำลังส่ง'}</b></p>)
        } else {
            return (<p>รอส่ง</p>)
        }
    }

    render() {
        return(
            <div>
                <Container>
                    <Row>
                        <Col xs lg="2"></Col>
                        <Col className="font-face">
                        { Array.from(this.state.message).map((ele,i) => 
                            (
                                <div>
                                    <hr></hr>
                                    <Row key={ele.email}>
                                        <Col sm>
                                            <p>{ele.email}</p>
                                        </Col>
                                        <Col lg="5">
                                            <p>สวัสดีคุณ {ele.user_name}</p>
                                            <p>อีก {ele.reviews_left_to_uprank} คุณจะได้เป็น {ele.user_next_rank_id}</p>
                                            <p>ร่วมแบ่งบันรีวิวกับเพื่อนสมาชิกกันนะค่ะ</p>
                                        </Col>
                                        <Col sm>
                                            {this.viewStatusText(i)}
                                        </Col>
                                    </Row>
                                </div>
                            )
                        )}
                            <Row>
                                {this.viewSubmitButton()}
                            </Row>
                        </Col>
                        <Col xs lg="2"></Col>
                    </Row>
                </Container> 
                
            </div>
        );
    }
}
export default EmailList;