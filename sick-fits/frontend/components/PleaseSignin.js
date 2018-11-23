import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignin = (props) => <Query query={CURRENT_USER_QUERY}>
    {({data, loading}) => {
        if(loading) {
            return <p>Loading...</p>
        } else if (!data.me) {
            return(
                <div>
                    <p>Please Sign in before continuing...</p>
                    <Signin />
                </div>
            )
        } else return props.children
    }}
</Query>

export default PleaseSignin;