import React from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row} from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import Chat from "../../Components/Common/Chat";
import Arena from "../../Components/Common/Arena";
import Bet from "../../Components/Common/Bet";

const Dashboard = () => {

  document.title="Legends | The Colosseum";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs={6} xl={3}>
              <Chat />
            </Col>
            <Col xs={12} xl={6}>
              <Arena />
            </Col>
            <Col xs={6} xl={3}>
              <Bet />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;