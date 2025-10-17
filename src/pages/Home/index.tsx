import React, { useEffect } from 'react';
import { Col, Container, Row } from "reactstrap";

const Home = () => {
  document.title = " Legends | The Colosseum";

  useEffect(() => {
    // Add a page-specific class to body and inject scoped styles
    const body = document.body;
    const styleId = "home-page-style";
    body.classList.add("page-home");

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
      body.page-home {
        margin: 0;
        font-family: 'Cinzel', serif;
        background: radial-gradient(circle at center, #5B3A29 0%, #1C1C1C 100%);
        color: #F5F1E3;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        letter-spacing: 0.5px;
      }

      body.page-home h1 {
        color: #F6AA1C;
        font-size: 6rem;
        margin-bottom: 0.5em;
        text-transform: uppercase;
        text-shadow: 0 0 10px rgba(246, 170, 28, 0.6);
      }
      
      body.page-home .btn-primary {
        margin-top: 2.5em;
        background-color: #E4572E;
        color: #fff;
        border: none;
        padding: 1em 2.5em;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: background 0.3s ease, transform 0.2s ease;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(228, 87, 46, 0.5);
      }

      body.page-home .btn-primary:hover {
        background-color: #F6AA1C;
        color: #1C1C1C;
        transform: scale(1.05);
        box-shadow: 0 0 15px rgba(246, 170, 28, 0.8);
      }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up: remove the class and the style tag when leaving page
      body.classList.remove("page-home");
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
                  <button className="btn-primary">Join the Battle</button>
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