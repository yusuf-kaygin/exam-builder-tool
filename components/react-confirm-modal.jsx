import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class Confirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };

    this.onButtonClick = this.onButtonClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onButtonClick() {
    this.setState({
      isOpened: true,
    });
  }

  onClose() {
    this.setState({
      isOpened: false,
    });
  }

  onConfirm() {
    this.setState({
      isOpened: false,
    });

    this.props.onConfirm();
  }


  render() {
    const {
      buttonBSStyle, buttonBSSize, buttonStyle, buttonText,
      title, body, cancelBSStyle, cancelText, confirmText, confirmBSStyle
    } = this.props;

    return (
      <Button bsStyle={buttonBSStyle} bsSize={buttonBSSize} onClick={this.onButtonClick} style={buttonStyle}>
        {buttonText}
        <Modal show={this.state.isOpened} onHide={this.onClose}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {body}
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle={cancelBSStyle} onClick={this.onClose}>{cancelText}</Button>
            <Button bsStyle={confirmBSStyle} onClick={this.onConfirm}>{confirmText}</Button>
          </Modal.Footer>
        </Modal>
      </Button>
    );
  }
}

Confirm.propTypes = {
  body: React.PropTypes.node.isRequired,
  buttonText: React.PropTypes.node.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  title: React.PropTypes.node.isRequired,
  confirmBSStyle: React.PropTypes.string,
  cancelBSStyle: React.PropTypes.string,
  confirmText: React.PropTypes.node,
  cancelText: React.PropTypes.node,
};

Confirm.defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelBSStyle: 'default',
  confirmBSStyle: 'danger',
};
