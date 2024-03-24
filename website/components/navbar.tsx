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
import Image from "next/image";
import { RootState } from "@/lib/store";
import Modal from "./modal";
import { Text } from "./text";
import { Button } from "./buttons";
import { useState } from "react";
import { client } from "./client";
import { ErrorMessage, Notification } from "./messages";

const NavbarFisch = () => {
  const router = useRouter();

  const { username, accessToken, isSignedIn, isAdmin } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  return (
    <>
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
            <Image
              src="/fisch.svg"
              height={30}
              width={37.5}
              alt="Wodkafisch logo"
              style={{ margin: 10 }}
            />
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
                  <NavDropdown.Item href="/admin/merch">Merch</NavDropdown.Item>
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
                      setIsDeleteAccountModalVisible(true);
                    }}
                  >
                    Remove Account
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
      <Modal
        isVisible={isDeleteAccountModalVisible}
        onClose={() => {
          setIsDeleteAccountModalVisible(false);
        }}
        style={{ width: "40%" }}
      >
        <Text text="Do you really want to delete your account?" />
        <Button
          text="Confirm"
          type="secondary"
          onPress={async () => {
            const config = {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            };
            const body = {
              username: username,
            };
            const res = await client.post("/remove-account", body, config);
            if (res.data.success) {
              setNotification("Successfully deleted your account.");
              dispatch(
                setUser({
                  username: null,
                  accessToken: null,
                  isSignedIn: false,
                  isAdmin: false,
                })
              );
              setIsDeleteAccountModalVisible(false);
              router.push("/");
              router.refresh();
            } else {
              setError(
                "An error occured while deleting your account. Please try again."
              );
            }
          }}
          style={{ borderColor: "white", color: "white", marginTop: 15 }}
        />
      </Modal>
      {error && (
        <ErrorMessage
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}
      {notification && (
        <Notification
          message={notification}
          onClose={() => {
            setNotification("");
          }}
        />
      )}
    </>
  );
};

export { NavbarFisch };
