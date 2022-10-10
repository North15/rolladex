import React from "react";
import Logo from "./sub/Logo";
import MenuLinks from "./sub/MenuLinks";
import MenuToggle from "./sub/MenuToggle";
import NavBarContainer from "./sub/NavBarContainer";
import ToggleLayout from "./sub/ToggleLayout";

const NavBar = (props) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <NavBarContainer {...props}>
            <Logo w="100px" />
            <MenuLinks isOpen={isOpen} />
            <ToggleLayout />
            <MenuToggle toggle={toggle} isOpen />
        </NavBarContainer>
    );
};

export default NavBar;
