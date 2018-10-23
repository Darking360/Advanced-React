import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY(
    $id: ID!
  ) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
    }
  }
`;

class UpdateItem extends Component {

  state = {};

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }

  /* ADD LATER IMAGE UPDATE FUNCTIONALITY AS WELL IN THE UPDATE
    uploadFile = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/darking360/image/upload',
      {
        method: 'POST',
        body: data
      }
    );

    const file = await response.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });

  } */

  updateItem = async (e, updateItem) => {
    e.preventDefault();
    const res = await updateItem();
  }

  render() {
    const { title, price, description, image } = this.state;
    const { id } = this.props;
    return(
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data: { item }, loading }) => {
          if (loading) return <p>Loading ...</p>
          else if (!item) return <p>No item found for ID {id}</p>
          else {
            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION} variables={{ ...this.state, id }}>
                {(updateItem, { loading, error }) => (
                  <Form onSubmit={(e) => this.updateItem(e, updateItem)}>
                    <h2>Sell an Item</h2>
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      {
                        /*
                          <label htmlFor="file">Title</label>
                          <input
                            type="file"
                            id="file"
                            name="file"
                            placeholder="Upload an image"
                            required
                            onChange={this.uploadFile}
                          />
                          { image && <img src={image} width="200" alt="Image product preview"/> }
                        */
                      }
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        value={title}
                        defaultValue={item.title}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="price">Price</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Item's price"
                        required
                        value={price}
                        defaultValue={item.price}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        required
                        value={description}
                        defaultValue={item.description}
                        onChange={this.handleChange}
                      />
                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            );
          }
        }}
      </Query>
    );
  }

}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
