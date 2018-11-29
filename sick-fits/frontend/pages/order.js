import OrderComponent from '../components/Order';
import PleaseSignin from '../components/PleaseSignin';

const Order = props => (
  <div>
    <PleaseSignin>
      <OrderComponent id={props.query.id} />
    </PleaseSignin>
  </div>
)

export default Order;
