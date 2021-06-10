import { IconButton } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import {
  CategorySharp,
  HomeOutlined,
  HomeWorkOutlined,
  LockOpen,
  MenuOutlined,
  PublishOutlined
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { $axios } from "../lib/axios";
import { AuthContext } from "../pages/login";

const useStyles = makeStyles({
  list: {
    width: 250
  }
});

const links = [
  {
    name: "Home",
    href: "/",
    icon: <HomeOutlined />
  },
  {
    name: "Category",
    href: "/category",
    icon: <CategorySharp />
  },
  {
    name: "Products",
    href: "/products",
    icon: <PublishOutlined />
  },
  {
    name: "Logout",
    href: "/logout",
    icon: <LockOpen />
  }
];

export default function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false
  });
  const { push } = useHistory();

  const handleLogout = async () => {
    setAuth({
      loggedIn: false,
      user: null
    });
    await $axios.post("/auth/logout", {
      refreshToken: localStorage.getItem("token")
    });
    localStorage.removeItem("token");
    push("/");
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {links.map(({ href, name, icon }, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText
              onClick={() => {
                if (href === "/logout") {
                  handleLogout();
                } else {
                  push(href);
                }
              }}
              primary={name}
            />
          </ListItem>
        ))}
      </List>

      {/* Alternative way */}
      {/* <List>
        <ListItem button>
          <ListItemIcon>
            <HomeWorkOutlined />
          </ListItemIcon>
          <ListItemText onClick={() => push("/")} primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CategorySharp />
          </ListItemIcon>
          <ListItemText onClick={() => push("/category")} primary="Category" />
        </ListItem>
      </List> */}
    </div>
  );

  return (
    <div>
      <React.Fragment>
        <IconButton onClick={toggleDrawer("left", true)}>
          <MenuOutlined />
        </IconButton>
        <Drawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
