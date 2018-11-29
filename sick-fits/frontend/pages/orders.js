import OrderListComponent from '../components/OrderList';
import PleaseSignin from '../components/PleaseSignin';

const Orders = props => (
  <div>
    <PleaseSignin>
      <OrderListComponent />
    </PleaseSignin>
  </div>
)

export default Orders;
