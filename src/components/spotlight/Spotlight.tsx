import React from 'react';

export interface SpotlightProp {
  onClose: () => void
  show: boolean,
  children: any
}

class Spotlight extends React.Component<SpotlightProp, {}> {
  render() {
    if (!this.props.show) {
      return null;
    }

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    } as React.CSSProperties;

    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      margin: '0 auto',
      maxWidth: 750,
      minHeight: 40,
    } as React.CSSProperties;

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Spotlight;
