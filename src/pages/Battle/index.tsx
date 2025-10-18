import React from 'react';
import {Col, Container, Row} from 'reactstrap';

const Battle = () => {

  document.title="Admin Colosseum | Battle management";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs={12} xl={12}>
              Battle
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Battle;