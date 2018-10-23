import React, { Component } from 'react';
import PaginationStyles from './styles/PaginationStyles';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

class Pagination extends Component {

  render() {
    const { page } = this.props;
    return(
      <Query query={PAGINATION_QUERY}>
        {({ loading, data, error }) => {
          if (loading) return <p>Loading</p>
          else {
            console.log(data);
            const count = data.itemsConnection.aggregate.count;
            const pages = Math.ceil(count/perPage);
            return(
              <PaginationStyles>
                <Head>
                  <title>Sick Fits! Page {page} of {pages}</title>
                </Head>
                <Link prefetch href={{ pathname: 'items', query: { page: page - 1 } }}>
                  <a className="prev" aria-disabled={page <= 1}>← Prev</a>
                </Link>
                <p>You are on page {page} of {pages}</p>
                <p>{count} Items Total</p>
                <Link prefetch href={{ pathname: 'items', query: { page: page + 1 } }}>
                  <a className="next" aria-disabled={page >= pages}>Next →</a>
                </Link>
              </PaginationStyles>
            );
          }
        }}
      </Query>
    );
  }

}

export default Pagination;
