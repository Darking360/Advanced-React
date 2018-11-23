import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
  ];

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
        id
        permissions
        name
        email
    }
  }
`;

const Permissions = (props) => (
    <Query query={ALL_USERS_QUERY}>
        {({ data, loading, error }) => (
            <div>
                <Error error={error} />
                <h2>Manage permissions</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            { possiblePermissions.map((item) => (<th key={item}>{item}</th>)) }
                            <th>👇</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.map((user) => <UserPermissions key={user.id} user={user} />)}
                    </tbody>
                </Table>
            </div>
        )}
    </Query>
)

class UserPermissions extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permissions:  PropTypes.array,
        }).isRequired,
    };
    state = {
        permissions: this.props.user.permissions,
    };
    handlePermissionsChanged = ({ target: { value, checked } }) => {
        const { permissions } = this.state;
        if (checked) this.setState({ permissions: [...permissions, value] });
        else this.setState({ permissions: permissions.filter((item) => item !== value) });
    }
    render(){
        const { user } = this.props;
        return(
            <Mutation
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id,
                }}
            >
                <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    { possiblePermissions.map((item) => {
                        return(
                            <td key={item}>
                                <label htmlFor={`${user.id}-permission-${item}`}>
                                    <input 
                                        id={`${user.id}-permission-${item}`}
                                        type="checkbox" 
                                        checked={this.state.permissions.includes(item)}
                                        value={item}
                                        onChange={this.handlePermissionsChanged} 
                                    />
                                </label>
                            </td>
                        );
                    }) }
                    <td>
                        <SickButton>UPDATE</SickButton>
                    </td>
                </tr>
            </Mutation>
        );
    }
}

export default Permissions;