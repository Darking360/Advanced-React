import React, { Component } from 'react';
import downshift from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import Downshift from 'downshift';

const SEARCH_ITEMS_QUERY = gql`
  query searchItemsQuery($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm },
        { description_contains: $searchTerm },
      ],
    }) {
      id
      title
      description
      image
      price
    }
  }
`;

const routeToItem = ({ id }) => {
  Router.push({
    pathname: '/item',
    query: { id },
  });
}

export class AutoComplete extends Component {
  state = {
    items: [],
    loading: false,
  };

  handleSearch = debounce(async ({ target: { value: searchTerm }}, client) => {
    this.setState({ loading: true }, async () => {
      const res = await client.query({ 
        query: SEARCH_ITEMS_QUERY,
        variables: { searchTerm },
      });
      this.setState({ items: res.data.items, loading: false });
    });
  }, 350)

  render() {
    const { items, loading } = this.state;
    return (
      <SearchStyles>
        <Downshift 
          itemToString={(item) => (item === null) ? '' : item.title }
          onChange={routeToItem}
        >
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {(client) => (
                  <input 
                    {...getInputProps({
                      onChange: (e) => {
                        e.persist();
                        this.handleSearch(e, client)
                      },
                      type: "search",
                      placeholder: 'Search for an Item',
                      id: 'search',
                      className: loading ? 'loading' : '',
                    })}
                  />
                )}
              </ApolloConsumer>
              {
                isOpen && (
                  <DropDown>
                    {items.map((item, index) => (
                      <DropDownItem 
                        key={item.id}
                        {...getItemProps({ item })}
                        highlighted={index === highlightedIndex}
                      >
                        <img width="50" src={item.image} alt={item.title} />
                        {item.title}
                      </DropDownItem>
                    ))}
                    { (items.length === 0 && !loading) && <DropDownItem>Nothing found for the input value: {inputValue}</DropDownItem> }
                  </DropDown>
                )
              }
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete;
