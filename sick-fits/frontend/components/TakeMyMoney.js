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

  onTokenResponse = async (res, createOrder) => {
    // Call manually createOrder
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch((error) => alert(error.message));
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_ORDER_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(createOrder) => (
          <User>
            {({ data: { me } }) => (
                <StripeCheckout
                    amount={calcTotalPrice(me.cart)}
                    name="Sick Fists"
                    description={`"Order of ${totalItems(me.cart)}" items`}
                    image={me.cart[0].item && me.cart[0].item.image}
                    stripeKey="pk_test_nV2HqANgNPjYtE42qrH3KyUh"
                    currency="USD"
                    email={me.email}
                    token={res => this.onTokenResponse(res, createOrder)}
                >{this.props.children}</StripeCheckout>
            )}
          </User>
        )}
      </Mutation>
    )
  }
}

export default TakeMyMoney
