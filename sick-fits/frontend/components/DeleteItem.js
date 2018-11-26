import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {

  handleDelete = (deleteItem) => {
    if (confirm('Are you sure you want to delete this?'))
      deleteItem()
      .catch((error) => alert(error.message));
  }

  update = (cache, payload) => {
    const { id } = this.props;
    // Manually update cache
    // Read the cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    data.items = data.items.filter((item) => item.id !== payload.data.deleteItem.id);
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  render() {
    const { id } = this.props;
    return(
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button onClick={() => this.handleDelete(deleteItem)}>Delete</button>
        )}
      </Mutation>
    );
  }

}

export default DeleteItem;
