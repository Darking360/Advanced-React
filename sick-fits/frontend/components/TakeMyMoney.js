import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const totalItems = (cart) => cart.reduce((tall, item) => tall + item.quantity, 0);

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

export class TakeMyMoney extends Component {
  static propTypes = {

  }

  onToken = (res, createOrder) => {
    console.log('Got token ---->')
    console.log(res.id)
    // Call manually createOrder
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch((error) => alert(error.message));
  }

  render() {
    const { token } = this.state;
    return (
      <Mutation
        mutation={CREATE_ORDER_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
      
      </Mutation>
    )
  }
}

export default TakeMyMoney
