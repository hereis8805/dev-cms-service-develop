import * as React from "react";
import { Field, Form } from "react-final-form";
import { Link, useHistory } from "react-router-dom";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslate, useLogin, useNotify, useSafeSetState } from "ra-core";
import { fetchUtils } from "react-admin";

const useStyles = makeStyles(
  (theme) => ({
    form: {
      padding: "0 1em 1em 1em",
    },
    input: {
      marginTop: "1em",
    },
    button: {
      width: "100%",
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
  { name: "RaLoginForm" }
);

const Input = ({
  meta: { touched, error }, // eslint-disable-line react/prop-types
  input: inputProps, // eslint-disable-line react/prop-types
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
);

const LoginForm = (props) => {
  const { redirectTo } = props;
  const [loading, setLoading] = useSafeSetState(false);
  const login = useLogin();
  const translate = useTranslate();
  const notify = useNotify();
  const classes = useStyles(props);
  const history = useHistory();

  const validate = (values) => {
    const errors = { name: undefined, email: undefined, password: undefined };

    if (!values.name) {
      errors.name = translate("ra.validation.required");
    }

    if (!values.email) {
      errors.email = translate("ra.validation.required");
    }
    if (!values.password) {
      errors.password = translate("ra.validation.required");
    }
    return errors;
  };

  const submit = (values) => {
    console.log(JSON.parse(JSON.stringify(values)));
    let body = JSON.parse(JSON.stringify(values));
    setLoading(true);
    fetchUtils
      .fetchJson(`${process.env.REACT_APP_API_PATH}/signup`, {
        headers: new Headers({
          Accept: "application/json",
        }),
        method: "POST",
        body: JSON.stringify(body),
      })
      .then(() => {
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_up_error"
            : error.message,
          "warning",
          {
            _:
              typeof error === "string"
                ? error
                : error && error.message
                ? error.message
                : undefined,
          }
        );
      });
  };

  return (
    <Form
      onSubmit={submit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.form}>
            <div className={classes.input}>
              <Field
                // autoFocus
                id="name"
                name="name"
                component={Input}
                label={translate("ra.auth.name")}
                disabled={loading}
              />
            </div>
            <div className={classes.input}>
              <Field
                id="email"
                name="email"
                component={Input}
                label={translate("ra.auth.email")}
                disabled={loading}
              />
            </div>
            <div className={classes.input}>
              <Field
                id="password"
                name="password"
                component={Input}
                label={translate("ra.auth.password")}
                type="password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>
          <CardActions>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              className={classes.button}
            >
              {loading && (
                <CircularProgress
                  className={classes.icon}
                  size={18}
                  thickness={2}
                />
              )}
              {translate("ra.auth.sign_up")}
            </Button>
          </CardActions>
          <CardActions>
            <Button
              type="button"
              disabled={loading}
              className={classes.button}
              onClick={() => {
                history.goBack();
              }}
            >
              {loading && (
                <CircularProgress
                  className={classes.icon}
                  size={18}
                  thickness={2}
                />
              )}
              {translate("ra.action.back")}
            </Button>
          </CardActions>
        </form>
      )}
    />
  );
};

export default LoginForm;
