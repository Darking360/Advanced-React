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
import TakeMyMoney from './TakeMyMoney';
import { adopt } from 'react-adopt';

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

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => {
    return (
        <Composed>
            {({ user, toggleCart, localState: { data: { cartOpen } } }) => {
                const me = user.data.me;
                if (!me) return null
                return (
                    <CartStyles open={cartOpen}>
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
                            <TakeMyMoney>
                                <SickButton>Checkout</SickButton>
                            </TakeMyMoney>
                        </footer>
                    </CartStyles>
                );
            }}
        </Composed>
    );
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION};