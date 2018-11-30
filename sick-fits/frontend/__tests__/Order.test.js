import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import NProgress from 'nprogress';
import Router from 'next/router';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { MockedProvider } from 'react-apollo/test-utils';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeOrderItem, fakeUser } from '../lib/testUtils';
import formatMoney from '../lib/formatMoney';

const items = [fakeOrderItem(), fakeOrderItem()];
const total = items.reduce((tall, node) => tall + node.quantity * node.price, 0);

const mocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: { id: 'abc123' },
    },
    result: {
      data: {
        order: {
          ...fakeOrderItem(),
          charge: 'xyz789',
          total, 
          items,
          user: fakeUser(),
          createdAt: new Date(),
        },
      },
    },
  },
]

describe('<Order />', () => {
  
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id='abc123' />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const order = wrapper.find('div[data-test="order"]');
    expect(toJSON(order)).toMatchSnapshot();

  });

  it('renders correct items length', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id='abc123' />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    const orderItems = wrapper.find('.order-item');
    expect(toJSON(orderItems)).toHaveLength(2);
  });

  it('shows the correct charge, total, and items count', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id='abc123' />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.find('span[data-test="total"]').text()).toEqual(formatMoney(total));
    expect(wrapper.find('span[data-test="charge"]').text()).toEqual('xyz789');
    expect(wrapper.find('span[data-test="count"]').text()).toEqual(items.length.toString());
  });

});