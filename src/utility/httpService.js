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
export const getChildAttributeByParentId = async (id) => {
  return await get(getChildAttributeByParent + id);
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
export const editChildCategory = async ( body) => {
  return await post(ChildCategory + "/update",  body);
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

export const deleteChildAttribute = async (id) => {
  return await deletee(Childattribute, id);
};

export const editChildAttribute = async (id, body) => {
  return await edit(Childattribute, id, body);
};

export const addChildAttribute = async (body) => {
  return await post(Childattribute, body);
};

// product

export const getProducts = async () => {
  return await get(Product);
};
export const getProductDetailById = async (id) => {
  return await get(ProductDetail + "/" + id);
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

// attribute image

export const addAttributeImage = async (body) => {
  return await post(AttributeImage, body);
};

// product section

export const getProductSections = async () => {
  return await get(ProductSection);
};
export const addProductSection = async (body) => {
  return await post(ProductSection, body);
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
      return await axios.put(url , body);
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
