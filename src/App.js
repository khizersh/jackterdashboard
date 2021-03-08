import Layout from "./Components/Layout";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import Home from "./pages/Home";
import ParentCategory from "./pages/parent/ParentCategory";
import ChildCategory from "./pages/child/ChildCategory";
import ImageComponent from "./pages/image/ImageComponent";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route  path="/parent" component={ParentCategory} />
            <Route  path="/child" component={ChildCategory} />
            <Route  path="/image" component={ImageComponent} />
          </Switch>
        </Layout>
      </Router>
      ;
    </>
  );
}

export default App;
