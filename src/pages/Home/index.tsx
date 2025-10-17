import React, { useEffect } from 'react';
import {Button, Col, Container, Row} from "reactstrap";
import {getWalletConnector} from "../../helpers/auth/walletConnector";
import {Link} from "react-router-dom";
import {connectWallet} from "../../helpers/auth/authentication";

const Home = () => {

  document.title = " Legends | The Colosseum";

  const [buttonLabel, setButtonLabel] = React.useState("Join the Battle");
  const [isLoading, setIsLoading] = React.useState(false);

  let walletConnector = getWalletConnector();

  const handleConnectWallet = async () => {
    setButtonLabel("Connecting...");
    setIsLoading(true);
    try {
      await connectWallet();
      window.location.href = '/dashboard';
    } catch (error) {
      console.log(error);
      setButtonLabel("Join the Battle");
      setIsLoading(false);
    }
  }

  const ButtonConnexion = () => {
    if (walletConnector.isMetaMaskInstalled()) {
      return (
        <Button className="btn-primary" onClick={() => { handleConnectWallet(); }} disabled={isLoading}>{buttonLabel}</Button>
      );
    }
    return (
      <Link className="btn-primary" to={'https://metamask.io/download'} target="_blank" rel="noopener noreferrer">
        Install MetaMask to continue
      </Link>
    );
  }

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
                  <ButtonConnexion />
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