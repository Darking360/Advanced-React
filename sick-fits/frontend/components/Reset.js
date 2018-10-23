import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $newPassword: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, newPassword: $newPassword, confirmPassword: $confirmPassword) {
      id
      name
    }
  }
`;

class Reset extends Component {

  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  state = {
    newPassword: '',
    confirmPassword: '',
  };

  handleChange = ({ target }) => {
    const { name, type, value } = target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e, resetPassword) => {
    e.preventDefault();
    const res = await resetPassword();
  }

  render() {
    const { newPassword, confirmPassword } = this.state;
    const { resetToken } = this.props;
    return(
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          ...this.state,
          resetToken,
        }}
        refetchQueries={[
          { query: CURRENT_USER_QUERY }
        ]}
      >
        {(resetPassword, { error, loading, called }) => (
          <Form method='post' onSubmit={(e) => this.handleSubmit(e,resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password Reset</h2>
              <Error error={error} />
              <label htmlFor="newPassword">
                Email
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="confirmPassword">
                Email
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type='submit'>Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }

}

export default Reset;
