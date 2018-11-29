import ItemComponent from '../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const FakeItem = {
  id: 'ABC123',
  title: 'Cool item',
  description: 'Cool description',
  price: 10000,
  image: 'dog.jpg',
  largeImage: 'dog_large.jpg', 
};

describe('<Item />', () => {

  it('render and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={FakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();

  });
  it('renders the price tag and title', () => {
    const wrapper = shallow(<ItemComponent item={FakeItem} />);
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$100');
    expect(wrapper.find('Title a').text()).toBe('Cool item');
    
  });

  it('renders image propertly', () => {
    const wrapper = shallow(<ItemComponent item={FakeItem} />);
    const Image = wrapper.find('img');
    expect(Image.props().src).toBe('dog.jpg');
    expect(Image.props().alt).toBe('Cool item');
  });

  it('renders the buttons propertly', () => {
    const wrapper = shallow(<ItemComponent item={FakeItem} />);
    const buttons = wrapper.find('.buttonList');
    expect(buttons.children()).toHaveLength(3);
    expect(buttons.find('Link').exists()).toBe(true);
    expect(buttons.find('Link')).toHaveLength(1);// Another way to do it
    expect(buttons.find('AddToCart').exists()).toBe(true);
    expect(buttons.find('DeleteItem').exists()).toBe(true);
  });
});