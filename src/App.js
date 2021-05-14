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
import ParentAttribute from "./pages/attribute/ParentAttribute";
import ChildAttribute from "./pages/attribute/ChildAttribute";
import ProductView from "./pages/product/ProductView";
import ProductForm from "./pages/product/ProductForm";
import ProductDetail from "./pages/product/ProductDetail";
import ProductEdit from "./pages/product/ProductEdit";
import SetPrice from "./pages/product/SetPrice";
import ProductSection from "./pages/section/ProductSection";
import SectionEdit from "./pages/section/Edit";
import SectionAdd from "./pages/section/Add";
import 'bootstrap/dist/css/bootstrap.min.css';
import Banner from "./pages/banner/Banner";
import EditProductAttribute from "./pages/product/EditProductAttribute";

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route  path="/parent" component={ParentCategory} />
            <Route  path="/child" component={ChildCategory} />
            <Route  path="/parent-attribute" component={ParentAttribute} />
            <Route  path="/child-attribute" component={ChildAttribute} />
            <Route  path="/image" component={ImageComponent} />
            <Route  path="/products" component={ProductView} />
            <Route  path="/product-form" component={ProductForm} />
            <Route  path="/product-edit/:id" component={ProductEdit} />
            <Route  path="/product-attribute/:id" component={EditProductAttribute} />
            <Route  path="/product-price/:id" component={SetPrice} />
            <Route  path="/product-detail/:id" component={ProductDetail} />
            <Route  path="/product-section" component={ProductSection} />
            <Route  path="/section-add" component={SectionAdd} />
            <Route  path="/section-edit/:id" component={SectionEdit} />
            <Route  path="/banner" component={Banner} />
          </Switch>
        </Layout>
      </Router>
      ;
    </>
  );
}

export default App;
