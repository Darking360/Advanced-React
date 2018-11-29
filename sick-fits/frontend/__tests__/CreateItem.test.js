import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

const dogImage = 'https://dog.com/dog.jpg';

// Mock fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [
      { secure_url: dogImage },
    ],
  }),
});

describe('Name of the group', () => {
  
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
  
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('uploads a file when changed ', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['fake_dog.jpg'] } });
    await wait();

    const component = wrapper.find('CreateItem').instance();
    expect(component.state.image).toEqual(dogImage);
    expect(global.fetch).toHaveBeenCalled();
  });

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    wrapper.find('#title').simulate('change', { target: { name: 'title', value: 'Awesome title' } });
    wrapper.find('#price').simulate('change', { target: { name: 'price', value: 10000 } });
    wrapper.find('#description').simulate('change', { target: { name: 'description', value: 'Lorem ipsum' } });
    await wait();
    const component = wrapper.find('CreateItem').instance();
    expect(component.state.title).toEqual('Awesome title');
    expect(component.state.price).toEqual(10000);
    expect(component.state.description).toEqual('Lorem ipsum');
  });

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            price: item.price,
            image: '',
            largeImage: '',
          },
        },
        result: {
          data: {
            createItem: {
              ...item,
              id: 'abc123',
              __typename: 'Item',
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );

    // Simulate form filling
    wrapper.find('#title').simulate('change', { target: { name: 'title', value: item.title } });
    wrapper.find('#price').simulate('change', { target: { name: 'price', value: item.price } });
    wrapper.find('#description').simulate('change', { target: { name: 'description', value: item.description } });

    Router.router = { push: jest.fn() };

    wrapper.find('form').simulate('submit');

    await wait(50);
    wrapper.update();

    expect(Router.router.push).toHaveBeenCalled();

  });

});

