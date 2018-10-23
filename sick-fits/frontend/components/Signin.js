import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
    }
  }
`;

class Signin extends Component {

  state = {
    name: '',
    email: '',
    password: ''
  };

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e, signin) => {
    e.preventDefault();
    const res = await signin();
    this.setState({ email: '', name: '', password: '' });
  }

  render() {
    const { email, name, password } = this.state;
    return(
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(signin, { error, loading }) => (
          <Form method='post' onSubmit={(e) => this.handleSubmit(e,signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign In</h2>
              <Error error={error} />
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
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default Signin;
