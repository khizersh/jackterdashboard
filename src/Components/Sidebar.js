import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Link } from "react-router-dom";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("small")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MiniDrawer({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [attribute, setAttribute] = React.useState(false);
  const [category, setCategory] = React.useState(false);
  const [product, setProduct] = React.useState(false);
  const [section, setSection] = React.useState(false);
  const [banner, setBanner] = React.useState(false);
  const [coupon, setCoupon] = React.useState(false);
  const [order, setOrder] = React.useState(false);
  const [user, setUser] = React.useState(false);
  const [review, setReview] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClickAttribute = () => {
    setAttribute(!attribute);
  };
  const handleClickCategory = () => {
    setCategory(!category);
  };
  const handleClickProduct = () => {
    setProduct(!product);
  };
  const handleClickSection = () => {
    setSection(!section);
  };
  const handleBanner = () => {
    setBanner(!banner);
  };
  const hanldeCoupon = () => {
    setCoupon(!coupon);
  };
  const handleOrder = () => {
    setOrder(!order);
  };
  const handleUser = () => {
    setUser(!user);
  };
  const handleReview = () => {
    setReview(!review);
  };

  const links = [
    { name: "Dashboard", path: "/", icon: <InboxIcon /> },
    {
      name: "Attribute",
      path: "/image",
      icon: <MailIcon />,
      onClick: handleClickAttribute,
      nested: true,
      open: attribute,
      child: [
        {
          name: "ParentAttribute",
          path: "/parent-attribute",
          icon: <MailIcon />,
        },
        {
          name: "ChildAttribute",
          path: "/child-attribute",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Category",
      path: "/image",
      icon: <MailIcon />,
      onClick: handleClickCategory,
      nested: true,
      open: category,
      child: [
        {
          name: "Parent Category",
          path: "/parent",
          icon: <MailIcon />,
        },
        {
          name: "Child Category",
          path: "/child",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Product",
      path: "/image",
      icon: <MailIcon />,
      onClick: handleClickProduct,
      nested: true,
      open: product,
      child: [
        {
          name: "Product view",
          path: "/products",
          icon: <MailIcon />,
        },
        {
          name: "Product add",
          path: "/product-form",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Product Section",
      path: "/image",
      icon: <MailIcon />,
      onClick: handleClickSection,
      nested: true,
      open: section,
      child: [
        {
          name: "Section view",
          path: "/product-section",
          icon: <MailIcon />,
        },
        {
          name: "Section add",
          path: "/section-add",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Order",
      path: "/image",
      icon: <MailIcon />,
      onClick: handleOrder,
      nested: true,
      open: order,
      child: [
        {
          name: "Order view",
          path: "/order",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Home Banner",
      path: "/banner",
      icon: <MailIcon />,
      onClick: handleBanner,
      nested: true,
      open: banner,
      child: [
        {
          name: "Banner View",
          path: "/banner",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Coupons",
      path: "/coupon",
      icon: <MailIcon />,
      onClick: hanldeCoupon,
      nested: true,
      open: coupon,
      child: [
        {
          name: "Coupon View",
          path: "/coupon",
          icon: <MailIcon />,
        },
        {
          name: "Coupon Add",
          path: "/coupon-add",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "User",
      path: "/user",
      icon: <MailIcon />,
      onClick: handleUser,
      nested: true,
      open: user,
      child: [
        {
          name: "User View",
          path: "/user",
          icon: <MailIcon />,
        },
      ],
    },
    {
      name: "Product Review",
      path: "/user",
      icon: <MailIcon />,
      onClick: handleReview,
      nested: true,
      open: review,
      child: [
        {
          name: "Reviews view",
          path: "/product-review",
          icon: <MailIcon />,
        },
      ],
    },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            The Jackter Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {links.map((m, index) =>
            m.nested ? (
              <>
                <ListItem button onClick={m.onClick}>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary={m.name} />
                  {m.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={m.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {m.child.length
                      ? m.child.map((child, i) => (
                          <Link
                            to={child.path}
                            key={i}
                            style={{ textDecoration: "none" }}
                          >
                            <ListItem key={i} button className={classes.nested}>
                              <ListItemIcon>
                                <StarBorder />
                              </ListItemIcon>
                              <ListItemText primary={child.name} />
                            </ListItem>
                          </Link>
                        ))
                      : null}
                  </List>
                </Collapse>
              </>
            ) : (
              <Link to={m.path} key={index} style={{ textDecoration: "none" }}>
                <ListItem button key={index}>
                  <ListItemIcon>{m.icon}</ListItemIcon>
                  <ListItemText primary={m.name} />
                </ListItem>
              </Link>
            )
          )}
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
