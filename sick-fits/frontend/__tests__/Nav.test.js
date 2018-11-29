import { mount } from 'enzyme';
import wait from 'waait';
import Nav from '../components/Nav';
import toJSON from 'enzyme-to-json';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: null,
      },
    },
  },
];

const signedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: fakeUser(),
      },
    },
  }
];

const signedInMocksWithCartItems = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  }
];

describe('<Nav />', () => {
  
  it('renders a minimal Nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    
    await wait();
    wrapper.update();
    
    const nav = wrapper.find('[data-test="nav"]');
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    
    await wait();
    wrapper.update();
    
    const nav = wrapper.find('ul[data-test="nav"]');
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(nav.children().length).toBe(7);
    expect(nav.children()).toContain('Sign Out');
  });

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );
    
    await wait();
    wrapper.update();
    
    const nav = wrapper.find('ul[data-test="nav"]');
    const count = nav.find('.count');
    // expect(toJSON(nav)).toMatchSnapshot();
    expect(count).toMatchSnapshot();

  });

});