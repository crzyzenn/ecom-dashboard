import { CategoryOutlined } from "@material-ui/icons";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import "./styles.css";
import Category from "./pages/category";
import Products from "./pages/products";
import { Button, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useContext } from "react";
import { SnackbarContext } from "./contexts/Snackbar";
import { AuthContext } from "./pages/login";
import { Field, Form, Formik } from "formik";
import { $axios } from "./lib/axios";

function Login() {
  const { auth, setAuth } = useContext(AuthContext);
  const handleLogin = async (params) => {
    try {
      const { data } = await $axios.post("/auth/login", params);
      setAuth({
        loggedIn: true,
        user: data.user
      });
      $axios.defaults.headers.Authorization = `Bearer ${data.access}`;
      localStorage.setItem("token", data.refresh);
    } catch (error) {
      console.log(error, error.response);
    }
  };
  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        onSubmit={handleLogin}
      >
        <Form>
          <Field name="email" label="email" type="email" as={TextField} />
          <Field
            name="password"
            label="password"
            type="password"
            as={TextField}
          />
          <Button type="submit">Login</Button>
        </Form>
      </Formik>
    </>
  );
}

// Use best practices...
// Structure your code...
// Create reusable components whenever necessary...
export default function App() {
  // how to get values from context????
  const { snackbar, closeSnackbar } = useContext(SnackbarContext);
  const {
    auth: { loggedIn }
  } = useContext(AuthContext);

  return (
    <div className="App">
      {/* Snackbar render */}
      <Snackbar
        open={snackbar.open} // true | false
        autoHideDuration={2000}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {loggedIn ? (
        <>
          <Header />
          <Switch>
            <Route path="/category">
              <Category />
            </Route>
            <Route path="/products">
              <Products />
            </Route>
            <Route path="/">
              <h1>Welcome to home page.</h1>
            </Route>
          </Switch>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
