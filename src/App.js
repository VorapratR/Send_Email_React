import React ,{Component} from 'react';
import emails from '../src/data/emails.csv';
import ranks from '../src/data/ranks.csv';
import * as d3 from 'd3';
import EmailList from './component/EmailList'
import _ from 'lodash';
import {Container, Row , Col, Button} from 'react-bootstrap'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailsList: [],
      ranksList: []
    };
  }

  async readCSVFile(nameFile) {
    if( nameFile === 'emails') {
      let raw_csv = await d3.csv(emails)
      if (raw_csv) {
        let csv = _.filter(raw_csv,(data) => {
          return data.email && data.user_name && data.user_next_rank_id && data.reviews_left_to_uprank
        })
      this.setState({emailsList: csv})
      }
    } else if (nameFile === 'ranks') {
      let raw_csv = await d3.csv(ranks);
      if (raw_csv) {
        let csv = _.filter(raw_csv,(data) => {
          return data.id && data.name
        })
      this.setState({ranksList: csv})
    }
    } else {
      console.log('Cannot find file')
    }
  }

  render() {
    return (
      <div>
        <Container>
      
          <Row>
            <Col xs lg="2"></Col>
            <Col>
              <Row className="App-header">
                <h1 >Mailer</h1>
              </Row>
              <Row>
                <Button className="buttonStyle" variant="outline-dark" onClick={() => this.readCSVFile('emails')}>เลือกไฟล์ emails.csv</Button>
              </Row>
              <Row>
                <Button className="buttonStyle" style={{width: '160px !important'}} variant="outline-dark" onClick={() => this.readCSVFile('ranks')}>เลือกไฟล์  ranks.csv</Button>
              </Row> 
              {
                this.state.emailsList.length !== 0 && this.state.ranksList.length !== 0 ?  
                (
                  <Row>
                    <Col className="testStyle" sm><b>อีเมล</b></Col>
                    <Col className="testStyle" lg="5"><b>ข้อความ</b></Col>
                    <Col className="testStyle" sm><b>สถานะ</b></Col>
                  </Row> 
                ) : null
              }
            </Col>
            <Col xs lg="2"></Col>
          </Row>
          {
            this.state.emailsList.length !== 0 && this.state.ranksList.length !== 0 ? 
            (<EmailList key={this.state} emailList={this.state.emailsList} rankList={this.state.ranksList}></EmailList>): null
          }
        </Container>
      </div>
    );
  }
  
}

export default App;
