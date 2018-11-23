import PermissionsComponent from '../components/Permissions';
import PleaseSignin from '../components/PleaseSignin';

const Permissions = props => ( 
    <div>
        <PleaseSignin>
            <PermissionsComponent />
        </PleaseSignin>
    </div>
)

export default Permissions;
