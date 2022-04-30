import React, { ReactNode } from 'react';
import './Spotlight.css';

export interface SpotlightProp {
  onClose: () => void;
  show: boolean;
  children: ReactNode;
}

class Spotlight extends React.Component<SpotlightProp, unknown> {
  render(): ReactNode {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="spotlight-backdrop">
        <div className="spotlight-modal">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Spotlight;
