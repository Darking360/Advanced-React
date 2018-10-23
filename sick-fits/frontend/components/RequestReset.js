import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {

  state = {
    email: '',
  };

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e, requestReset) => {
    e.preventDefault();
    const res = await requestReset();
    this.setState({ email: '' });
  }

  render() {
    const { email } = this.state;
    return(
      <Mutation
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, { error, loading, called }) => (
          <Form method='post' onSubmit={(e) => this.handleSubmit(e,requestReset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password Reset</h2>
              <Error error={error} />
              { !error && !loading && called && (
                <p>Success! Check your email for a reset link</p>
              )}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Request!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default RequestReset;
