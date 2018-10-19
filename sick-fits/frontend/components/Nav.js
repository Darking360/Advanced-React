import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = props => (
  <NavStyles>
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
  </NavStyles>
);

export default Nav;
