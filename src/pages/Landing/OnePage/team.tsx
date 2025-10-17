import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col, Container, Row} from 'reactstrap';

const data = [
  {
    "name": "Maxime",
    "description": "Digital Artist",
    "img": "",
    "instagram": "https://www.instagram.com/mhsmax/",
    "twitter": "https://twitter.com/HacquardMaxime"
  }, {
    "name": "Solaris",
    "description": "Founder",
    "img": "",
  }, {
    "name": "Dara",
    "description": "General Manager",
    "img": ""
  }, {
    "name": "Hando",
    "description": "IT Wizard",
    "img": "",
    "instagram": "https://www.instagram.com/handosensei/",
    "twitter": "https://twitter.com/HandoSensei"
  }
];


const Team = () => {
  const [team, ] = useState(data);

  return (
    <React.Fragment>
      <section className="section bg-light" id="team">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center mb-5">
                <h3 className="mb-3 fw-bold">Our <span className="text-danger">Team</span></h3>
              </div>
            </Col>
          </Row>
          <Row>
            {team.map((member, key) => (
              <Col lg={3} sm={6} key={key}>
                <Card>
                  <CardBody className="text-center p-4">
                    <div className="avatar-xl mx-auto mb-4 position-relative">
                      <img src={member['img']} alt="" className="img-fluid rounded-circle"/>
                    </div>
                    <h5 className="mb-1">{member['name']}</h5>
                    <p className="text-muted mb-0 ff-secondary">{member['description']}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}


          </Row>

        </Container>
      </section>
    </React.Fragment>
  );
};

export default Team;