import { getFullUrl } from "../../services/1apiClientService";
const authzeroAuthHref = getFullUrl('auth/authzero');

const Login = () => {

  const handleAuthZeroLogin = () => {
    window.location.href = authzeroAuthHref;
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleAuthZeroLogin}>Login with Auth0</button>
    </div>
  );
};

export default Login;