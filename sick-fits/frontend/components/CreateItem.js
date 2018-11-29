import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
    }
  }
`;

class CreateItem extends Component {

  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  };

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }

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

  }

  render() {
    const { title, price, description, image } = this.state;
    return(
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form data-test="form" onSubmit={async (e) => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              });
            }}>
            <h2>Sell an Item</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
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
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={title}
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
                onChange={this.handleChange}
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                required
                value={description}
                onChange={this.handleChange}
              />
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
