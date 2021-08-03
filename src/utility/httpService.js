import axios from "axios";
import {
  ChildCategory,
  ParentCategory,
  Image,
  Get_Image,
  Update_Image,
  Parentattribute,
  Childattribute,
  Product,
  ProductDetail,
  ProductImage,
  ProductPrice,
  ProductPriceByProductId,
  ProductPriceUpdate,
  getChildCategoryByParentId,
  getChildAttributeByParent,
  AttributeImage,
  ProductSection,
  ProductSectionItem,
  HomeBanner,
  AttributeMultiImage,
  Coupon,
  Point,
  Checkout,
  User,
  Review,
  UserCoupon,
  Order,
  CacheData,
  ProductSectionCache,
} from "./apiLinks";

// parent cat
export const addParentCategory = async (data) => {
  return await post(ParentCategory, data);
};

export const getParentCategory = async (data) => {
  return await get(ParentCategory);
};
export const deleteParentCategory = async (id) => {
  return await deletee(ParentCategory, id);
};
export const editParentCategory = async (id, body) => {
  return await edit(ParentCategory, id, body);
};

// child cat

export const getChildCategory = async () => {
  return await get(ChildCategory);
};

export const getChildCategoryListByParentId = async (id) => {
  return await get(getChildCategoryByParentId + id);
};

export const addChildCategory = async (data) => {
  return await post(ChildCategory, data);
};

export const deleteChildCategory = async (id) => {
  return await deletee(ChildCategory, id);
};
export const editChildCategory = async (body) => {
  return await post(ChildCategory + "/update", body);
};

// image
export const addImage = async (data) => {
  return await post(Image, data);
};

export const getImages = async () => {
  return await get(Get_Image);
};

export const updateImages = async (data) => {
  return await post(Update_Image, data);
};

export const deleteImageById = async (id) => {
  return await deletee(Get_Image, id);
};

// attribute parent

export const getParentAttribute = async () => {
  return await get(Parentattribute);
};

export const deleteParentAttribute = async (id) => {
  return await deletee(Parentattribute, id);
};

export const editParentAttribute = async (id, body) => {
  return await edit(Parentattribute, id, body);
};

export const addParentAttribute = async (body) => {
  return await post(Parentattribute, body);
};

// attribute child

export const getChildAttribute = async () => {
  return await get(Childattribute);
};
export const getChildAttributeByParentId = async (id) => {
  return await get(getChildAttributeByParent + id);
};
export const deleteChildAttribute = async (id) => {
  return await deletee(Childattribute, id);
};

export const editChildAttribute = async (id, body) => {
  return await post(Childattribute + "/update",  body);
};

export const addChildAttribute = async (body) => {
  return await post(Childattribute, body);
};

// product

export const getProducts = async () => {
  return await get(Product);
};
export const getProductsCache = async () => {
  return await get(CacheData + "/product");
};
export const addProductCache = async () => {
  return await post(CacheData + "/product" , "");
};
export const getProductDetailById = async (id) => {
  return await get(ProductDetail + "/" + id);
};
export const getProductFullDetailById = async (id) => {
  return await get(Product + "/full/" + id);
};

export const deleteProductById = async (id) => {
  return await deletee(Product, id);
};

export const editProduct = async (id, body) => {
  return await edit(Product, id, body);
};

export const addProduct = async (body) => {
  return await post(Product, body);
};

// product image
export const editProductImage = async (id, body) => {
  return await edit(ProductImage, id, body);
};

export const deleteProductImage = async (id) => {
  return await deletee(ProductImage, id);
};

// product price

export const getProductPriceListById = async (id) => {
  return await get(ProductPriceByProductId + id);
};

export const updateAttributePrice = async (body) => {
  return await post(ProductPriceUpdate, body);
};

// product attribute

export const updateProductAttribute = async (body) => {
  return await post(Product + "/parent", body);
};

export const addChildAttributeToProduct = async (body) => {
  return await post(Product + "/child", body);
};
export const removeSubAttribute = async (body) => {
  return await post(Product + "/sub", body);
};
export const removeParentAttributeOfProduct = async (id) => {
  return await deletee(Product + "/remove-parent", id);
};

// attribute image

export const addAttributeImage = async (body) => {
  return await post(AttributeImage, body);
};
export const deleteAttributeImage = async (id) => {
  return await deletee(AttributeMultiImage, id);
};

// product section

export const getProductSections = async () => {
  // return await get(ProductSection);
  return await get(ProductSectionCache);
};
export const addProductSection = async (body) => {
  return await post(ProductSection, body);
};
export const removeSectionItem = async (body) => {
  return await post(ProductSectionItem + "/remove", body);
};
export const addSectionCache = async (body) => {
  return await post(ProductSectionCache, body);
};

export const getItemsBySectionId = async (id) => {
  return await get(ProductSectionItem + "/" + "section/" + id);
};
export const addSectionItemWithList = async (body) => {
  return await post(ProductSectionItem + "/" + "all", body);
};
export const changeItemPosition = async (body) => {
  return await post(ProductSectionItem + "/" + "position", body);
};

// home page banner

export const getBanners = async () => {
  return await get(HomeBanner);
};
export const addBanner = async (body) => {
  return await post(HomeBanner, body);
};
export const editBanner = async (body) => {
  return await post(HomeBanner + "/" + "edit", body);
};
export const deleteBanner = async (id) => {
  return await deletee(HomeBanner, id);
};

// coupon

export const getCoupons = async () => {
  return await get(Coupon);
};
export const getCouponById = async (id) => {
  return await get(Coupon + "/" + id);
};
export const addCoupon = async (body) => {
  return await post(Coupon, body);
};
export const editCoupon = async (body) => {
  return await post(Coupon + "/" + "edit", body);
};
export const deleteCoupon = async (id) => {
  return await deletee(Coupon, id);
};

// Point

export const getPointByProductId = async (id) => {
  return await get(Point + "/product/" + id);
};
export const addPoint = async (body) => {
  return await post(Point, body);
};
export const editPoint = async (body) => {
  return await post(Point + "/" + "edit", body);
};
export const deletePoint = async (id) => {
  return await deletee(Point, id);
};

// Order

export const getAllCheckout = async () => {
  return await get(Checkout);
};
export const getCheckoutById = async (id) => {
  return await get(Checkout + "/" + id);
};
export const addCheckout = async (body) => {
  return await post(Checkout, body);
};

// User

export const getAllUser = async () => {
  return await get(User);
};

// reviews

export const getAllReviews = async () => {
  return await get(Review);
};
export const addReviewByAdmin = async (body) => {
  return await post(Review + "/admin", body);
};
export const editReview = async (body) => {
  return await post(Review + "/edit", body);
};
export const deleteReview = async (id) => {
  return await deletee(Review, id);
};

// user coupons

export const getCouponByUser = async (id) => {
  return await get(UserCoupon + "/user/" + id);
};
export const deleteAssignCoupon = async (id) => {
  return await deletee(UserCoupon, id);
};
export const assignCouponToUser = async (body) => {
  return await post(UserCoupon + "/user/assign", body);
};

// user orders

export const getAllOrders = async () => {
  return await get(Order);
};
export const getOrderByCheckoutId = async (id) => {
  return await get(Order + "/checkout/" + id);
};
export const getOrderByUserId = async (id) => {
  return await get(Order + "/user/" + id);
};
export const getOrderById = async (id) => {
  return await get(Order + "/" + id);
};


// helper functions
const post = async (url, data) => {
  try {
    return await axios.post(url, data);
  } catch (error) {
    console.log(error);
  }
};

const get = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

const edit = async (url, id, body) => {
  try {
    if (id) {
      return await axios.put(url + "/" + id, body);
    } else {
      return await axios.put(url, body);
    }
  } catch (error) {
    return error;
  }
};

const deletee = async (url, id) => {
  try {
    return await axios.delete(url + "/" + id);
  } catch (error) {
    console.log(error);
  }
};
