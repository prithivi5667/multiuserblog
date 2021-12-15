import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';
import NProgress from 'nprogress';
import { APP_NAME } from '../config';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, signout } from '../actions/auth';
import Search from './blog/Search';

/* TODO: Refactor to improve component logic
 It’s because React expects the one rendered on the server should be the same with one rendered on client during hydration. It’s okay to use window type-checking before doing DOM access/operations but make sure it won’t affect rendering difference between client and server. */

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    process.browser && setIsBrowser(true);
  }, []);

  return (
    <>
      <Navbar className="sticky-top" color="light" light expand="md">
        <Link href="/">
          <NavLink className="navbar-brand font-weight-bold">{APP_NAME}</NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link href="/blogs">
                <NavLink>Blogs</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/contact">
                <NavLink>Contact</NavLink>
              </Link>
            </NavItem>
            {isBrowser && !isAuth() && (
              <>
                <NavItem>
                  <Link href="/signin">
                    <NavLink>Signin</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink>Signup</NavLink>
                  </Link>
                </NavItem>
              </>
            )}
            {isBrowser && isAuth() && isAuth().role === 0 && (
              <NavItem>
                <Link href="/user">
                  <NavLink style={{ cursor: 'pointer' }}>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isBrowser && isAuth() && isAuth().role === 1 && (
              <NavItem>
                <Link href="/admin">
                  <NavLink style={{ cursor: 'pointer' }}>{`${isAuth().name}'s Dashboard`}</NavLink>
                </Link>
              </NavItem>
            )}
            {isBrowser && isAuth() && (
              <NavItem>
                <NavLink
                  style={{ cursor: 'pointer' }}
                  onClick={() => signout(() => Router.replace(`/signin`))}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              <Link href="/user/crud/blog">
                <NavLink className="btn btn-primary text-light">Write a blog</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </>
  );
};

export default Header;
