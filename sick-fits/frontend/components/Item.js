import React, { Component } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

import formatMoney from '../lib/formatMoney';

class Item extends Component {

  static propTypes = {
    item: PropTypes.shape({
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      largeImage: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  };

  render() {
    const { item } = this.props;
    return(
      <ItemStyles>
        {item.image && <img src={item.image} alt={item.title}/>}
        <Title>
          <Link href={{
            pathname: 'item',
            query: { id: item.id }
          }}>
            <a>
              {item.title}
            </a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>
        <p>{item.description}</p>
        <div className="buttonList">
          <Link href={{
            pathname: 'update',
            query: { id: item.id }
          }}>
            <a>Edit ✏️</a>
          </Link>
          <AddToCart id={item.id} />
          <DeleteItem id={item.id} />
        </div>
      </ItemStyles>
    );
  }
}

export default Item;
