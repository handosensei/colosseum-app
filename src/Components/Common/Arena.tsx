import React from 'react';
import {Card, CardBody} from "reactstrap";

const Arena = () => {
  return (
    <React.Fragment>
      <Card>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Live Battle</h4>
          <div className="flex-shrink-0">
            <div>
              <button type="button" className="btn btn-soft-primary btn-sm">
                Live
              </button>
            </div>
          </div>
        </div>
        <CardBody>

        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default Arena;