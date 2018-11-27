import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import User from './User';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;

const Cart = () => {
    return (
        <User>
            {({ data: { me } }) => {
                console.log(me);
                if (!me) return null;
                else return (
                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                    {(toggleCart) => (
                        <Query query={LOCAL_STATE_QUERY}>
                            {({ data }) => (
                                <CartStyles open={data.cartOpen}>
                                    <header>
                                        <CloseButton title="close" onClick={toggleCart}>&times;</CloseButton>
                                        <Supreme>Your Cart</Supreme>
                                        <p>{me.name} have {me.cart.length} item{me.cart.length !== 1 ? 's' : null} in your cart</p>
                                    </header>
                                    <ul>
                                        {me.cart.map((item) => (
                                            <CartItem
                                                key={item.id}
                                                cartItem={item}
                                            />
                                        ))}
                                    </ul>
                                    <footer>
                                        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                                        <SickButton>Checkout</SickButton>
                                    </footer>
                                </CartStyles>
                            )}
                        </Query>
                    )}
                    </Mutation>
                )
            }}
        </User>
    );
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION};