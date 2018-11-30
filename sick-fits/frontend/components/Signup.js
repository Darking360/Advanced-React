import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {

  state = {
    name: '',
    email: '',
    password: ''
  };

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e, signup) => {
    e.preventDefault();
    const res = await signup();
    this.setState({ email: '', name: '', password: '' });
  }

  render() {
    const { email, name, password } = this.state;
    return(
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(signup, { error, loading }) => (
          <Form data-test="form" method='post' onSubmit={(e) => this.handleSubmit(e,signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an account</h2>
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
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
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
              <button type='submit'>Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default Signup;
export { SIGNUP_MUTATION };
