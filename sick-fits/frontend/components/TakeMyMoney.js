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

export class TakeMyMoney extends Component {
  static propTypes = {

  }

  render() {
    return (
      <div>
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
                    token={res => this.onTokenResponse}
                >{this.props.children}</StripeCheckout>
            )}
        </User>
      </div>
    )
  }
}

export default TakeMyMoney
