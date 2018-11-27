import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
    font-size: 4rem;
    background: none;
    border: none;
    &:hover {
        color: ${({ theme }) => theme.red};
        cursor: pointer;

    }
`;

const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

class RemoveFromCart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
    };

    // Gets called as soon as we get a response back from the server after the mutation
    update = (cache, payload) => {
        // Read the cache
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });
        // Remove the item from the cart
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter((item) => item.id !== cartItemId);
        // Write it back to the cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    }

    render() {
        const { id } = this.props;
        return (
            <Mutation
                mutation={REMOVE_FROM_CART_MUTATION}
                variables={{ id }}
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: { __typename: 'CartItem', id }
                }}
            >
                {(removeFromCart, { loading }) => (
                    <BigButton 
                        disabled={loading} 
                        title="Delete Item"
                        onClick={() => {
                            removeFromCart().catch((err) => alert(err.message));
                        }}
                    >
                        &times;
                    </BigButton>
                )}
            </Mutation>
        );
    }
}

export default RemoveFromCart;