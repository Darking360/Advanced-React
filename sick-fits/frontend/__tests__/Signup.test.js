import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloConsumer } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', { target: { name, value } });
}

const me = fakeUser();

// Mocks
const mocks = [
  // Signup mock mutation
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: '1234',
      },
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // Current user query mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
];

describe('<Signup />', () => {
  
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    );

    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('calls the mutation propertly', async () => {
    let apolloCLient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloCLient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    type(wrapper, 'name', me.name);
    type(wrapper, 'email', me.email);
    type(wrapper, 'password', '1234');
    wrapper.update();

    wrapper.find('form').simulate('submit');
    await wait();

    // Query the user out
    const user = await apolloCLient.query({
      query: CURRENT_USER_QUERY,
    });

    

  });

});

