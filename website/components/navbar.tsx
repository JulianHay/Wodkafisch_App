"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "../utils/auth";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/lib/reducers/userSlice";
// import "../public/scss/styles.scss";
import "./styles.css";

const NavbarFisch = () => {
  const router = useRouter();

  const { username, accessToken, isSignedIn, isAdmin } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  return (
    <Navbar
      expand="lg"
      data-bs-theme="dark"
      style={{
        backgroundColor: "#000022ff",
        borderBottomWidth: 0.2,
        borderColor: "white",
      }}
    >
      <Container>
        <Navbar.Brand href="/">
          <img src="/fisch.svg" style={{ height: 30, margin: 10 }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end text-white"
        >
          <Nav>
            {isSignedIn ? (
              <>
                <Nav.Link href="/map">Map</Nav.Link>
                <Nav.Link href="/pictures">Pictures</Nav.Link>
                <Nav.Link href="/sponsors">Sponsors</Nav.Link>
              </>
            ) : null}

            {isAdmin ? (
              <NavDropdown
                title="Admin"
                id="basic-nav-dropdown"
                style={{ backgroundColor: "#000022ff" }}
              >
                <NavDropdown.Item href="/admin/new_event">
                  New Event
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/add_donation">
                  Add Donation
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/add_bonus">
                  Add Bonus
                </NavDropdown.Item>
                <NavDropdown.Item href="/admin/new_season">
                  New Season
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
            {isSignedIn ? (
              // <Nav.Link href="/profile">Profile</Nav.Link>

              <NavDropdown
                title="Profile"
                id="basic-nav-dropdown"
                style={{ backgroundColor: "#000022ff" }}
              >
                <NavDropdown.Item href="/profile/change_password">
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => {
                    dispatch(
                      setUser({
                        username: null,
                        accessToken: null,
                        isSignedIn: false,
                        isAdmin: false,
                      })
                    );
                    router.push("/");
                    router.refresh();
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export { NavbarFisch };
