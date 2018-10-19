import React, { Component } from 'react';
import Header from './Header';

class Page extends Component {

  render() {
    const { children } = this.props;
    return(
      <div>
        <Header />
        { children }
      </div>
    )
  }
}

export default Page;
