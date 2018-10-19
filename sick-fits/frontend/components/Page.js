import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const StyledPage = styled.div`
  background: white;
  color: ${({ theme }) => theme.black};
`;

const PageSizer = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

class Page extends Component {

  render() {
    const { children } = this.props;
    return(
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <PageSizer>
            { children }
          </PageSizer>
        </StyledPage>
      </ThemeProvider>
    )
  }
}

export default Page;
