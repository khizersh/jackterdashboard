import axios from "axios";
import { ChildCategory, ParentCategory, Image ,Get_Image, Update_Image} from "./apiLinks";

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

export const addChildCategory = async (data) => {
  return await post(ChildCategory, data);
};

export const deleteChildCategory = async (id) => {
  return await deletee(ChildCategory, id);
};
export const editChildCategory = async (id, body) => {
  return await edit(ChildCategory, id, body);
};

// image
export const addImage = async (data) => {
  return await post(Image, data);
};

export const getImages = async () => {
  return await get(Get_Image);
};

export const updateImages = async (data) => {
  return await post(Update_Image , data);
};

export const deleteImageById = async (id) => {
  return await deletee(Get_Image , id);
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
    return await axios.put(url + "/" + id, body);
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
