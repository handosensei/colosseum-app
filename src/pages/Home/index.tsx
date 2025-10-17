import React, { useEffect } from 'react';
import { Col, Container, Row } from "reactstrap";
import {Link} from "react-router-dom";

const Home = () => {
  document.title = " Legends | The Colosseum";

  useEffect(() => {
    // Add a page-specific class to body and inject scoped styles
    const body = document.body;
    const styleId = "home-page-style";
    body.classList.add("home");

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up: remove the class and the style tag when leaving page
      body.classList.remove("home");
      const style = document.getElementById(styleId);
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <React.Fragment>
      <div className="layout-wrapper landing">
        <section className="section nft-hero" id="hero">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} sm={10}>
                <div className="text-center">
                  <h1 style={{fontFamily: "Cinzel, serif"}}>The Colosseum</h1>
                  <Link to="/dashboard" className="btn-primary">Join the Battle</Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </React.Fragment>
  );
};

export default Home;