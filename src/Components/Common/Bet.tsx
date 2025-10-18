import React from 'react';
import {Card, CardBody, CardFooter} from "reactstrap";

const Bet = () => {
  return (
    <React.Fragment>
      <Card>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Battle Arena</h4>
          <div className="flex-shrink-0">
            <div>
              <button type="button" className="btn btn-soft-primary btn-sm">
                See All
              </button>
            </div>
          </div>
        </div>
        <CardBody>
          <div className="chat-widget">
            <div className="chat-item chat-item-left">
              <div className="chat-item-content">
                <p className="chat-text">
                  Hi, How are you? What about our next meeting?
                </p>
                <span className="chat-time">10:20 AM</span>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="chat-input">
            <input type="text" placeholder="Type here" className="form-control" />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}

export default Bet;