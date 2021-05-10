import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { VscAccount, VscSignOut, VscHome } from 'react-icons/vsc';
import { useKeycloak } from '@react-keycloak/web';
import { Link, withRouter } from 'react-router-dom';
import useOutsideClick from '../../hooks/useOutsideClick';
import Aux from '../../hoc/Auxiliary';

function AccountDropdown({ open, handleOpen, history }) {
  const { keycloak, initialized } = useKeycloak();
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, handleOpen);

  const handleLogOut = () => {
    if (keycloak.authenticated) {
      history.push('/');
      keycloak.logout();
    }
  };

  return (
    <Aux>
      {open ? (
        <div className="dropdown dropdown--account" ref={open ? wrapperRef : null}>
          <Link to="/profile/account" className="link dropdown__item dropdown__item--account">
            <span className="dropdown__item__icon"><VscAccount /></span>
            <div className="dropdown__item__text">
              Manage account
            </div>
          </Link>
          <Link to="/profile/myproperties" className="link dropdown__item dropdown__item--account">
            <span className="dropdown__item__icon"><VscHome /></span>
            <div className="dropdown__item__text">
              My properties
            </div>
          </Link>
          <Link exact={true} to="/signout" onClick={handleLogOut} className="link dropdown__item dropdown__item--account">
            <span className="dropdown__item__icon"><VscSignOut /></span>
            <div className="dropdown__item__text">
              Sign out
            </div>
          </Link>
        </div>
      )
        : null}
    </Aux>
  );
}

AccountDropdown.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
};

AccountDropdown.defaultProps = {
  open: false,
};

export default withRouter(AccountDropdown);