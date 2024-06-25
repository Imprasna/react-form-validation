import React from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

function Example({ individualData, show, setShow }) {
    
    const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>User Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <div className="view-element">
								<div className="basics">
									<div className="view-name"><p>{individualData?.firstName}&nbsp; {individualData?.lastName}</p></div> |
									<div><Alert.Link href={`mailto:${ individualData?.email }`}>{individualData?.email}</Alert.Link></div> |
									<div><Alert.Link href={`tel:${ individualData?.phoneNumber }`}>{individualData?.phoneNumber}</Alert.Link></div>,
									<p className="qualification">({individualData?.qualification})</p>
								</div>
								<div className="address">
									<p>{individualData?.city}, {individualData?.state}, {individualData?.country}, {individualData?.zipCode}</p>
								</div>
								<div>Comment: <p className="comment-box">{individualData?.comments}</p></div>
							</div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Example;