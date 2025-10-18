import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { useAuthStore } from '../../store/useAuthStore';

//import images
import avatar1 from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {

    const { user, isAdmin } = useAuthStore();

    const [isProfileDropdown, setIsProfileDropdown] = useState<boolean>(false);

    //Dropdown Toggle
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user?.username}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {user?.username}!</h6>
                    <DropdownItem href={process.env.PUBLIC_URL + "/profile"}><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Profile</span></DropdownItem>

                    {isAdmin() && (
                      <>
                          <div className="dropdown-divider"></div>
                          <h6 className="dropdown-header">Admin management</h6>
                          <DropdownItem href={process.env.PUBLIC_URL + "/battles"}>
                              <i className="mdi mdi-axe-battle text-muted fs-16 align-middle me-1"></i>
                              <span className="align-middle">Battles</span>
                          </DropdownItem>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    <DropdownItem>
                        <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Balance : <b>$5971.67</b></span>
                    </DropdownItem>

                    <DropdownItem href={process.env.PUBLIC_URL + "/logout"}><i
                        className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;