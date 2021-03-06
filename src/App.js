import Layout from "./Components/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
import Banner from "./pages/banner/Banner";
import EditProductAttribute from "./pages/product/EditProductAttribute";
import Coupon from "./pages/coupon/Coupon";
import CouponForm from "./pages/coupon/CouponForm";
import Order from "./pages/order/Order";
import OrderDetail from "./pages/order/OrderDetail";
import User from "./pages/user/User";
import Review from "./pages/review/Review";
import UserCoupons from "./pages/user/UserCoupons";
import UserOrder from "./pages/user/UserOrder";
import MainProvider from "./context/MainContext"
import Loader from "./Components/loader/Loader"

function App() {
  return (
    <>
      <Router>
        <MainProvider>
          <Loader />
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/parent" component={ParentCategory} />
              <Route path="/child" component={ChildCategory} />
              <Route path="/parent-attribute" component={ParentAttribute} />
              <Route path="/child-attribute" component={ChildAttribute} />
              <Route path="/image" component={ImageComponent} />
              <Route path="/products" component={ProductView} />
              <Route path="/product-form" component={ProductForm} />
              <Route path="/product-edit/:id" component={ProductEdit} />
              <Route
                path="/product-attribute/:id"
                component={EditProductAttribute}
              />
              <Route path="/product-price/:id" component={SetPrice} />
              <Route path="/product-detail/:id" component={ProductDetail} />
              <Route path="/product-section" component={ProductSection} />
              <Route path="/section-add" component={SectionAdd} />
              <Route path="/section-edit/:id" component={SectionEdit} />
              <Route path="/banner" component={Banner} />
              <Route path="/coupon" component={Coupon} />
              <Route path="/coupon-add" component={CouponForm} />
              <Route path="/order" component={Order} />
              <Route path="/order-detail/:id" component={OrderDetail} />
              <Route path="/user" component={User} />
              <Route path="/user-coupon/:id" component={UserCoupons} />
              <Route path="/user-order/:id" component={UserOrder} />
              <Route path="/product-review" component={Review} />
            </Switch>
          </Layout>
        </MainProvider>
      </Router>
      ;
    </>
  );
}

export default App;
