import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled from 'styled-components';

const Button = styled.button`
  background: red;
  font-size: ${({huge}) => huge ? '100px' : '50px'};
`;

class Page extends Component {

  render() {
    const { children } = this.props;
    return(
      <div>
        <Meta />
        <Header />
        <Button huge>Click me</Button>
        { children }
      </div>
    )
  }
}

export default Page;
