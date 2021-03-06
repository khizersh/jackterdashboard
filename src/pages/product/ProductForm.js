import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Input, Button } from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";
import MultipleValueTextInput from "react-multivalue-text-input";
import {
  addProduct,
  getParentAttribute,
  getParentCategory,
  getChildCategoryListByParentId,
  getChildAttributeByParentId,
  addAttributeImage,
  addPoint,
} from "../../utility/httpService";
import swal from "sweetalert";
import Select from "react-select";
import ReactQuill from "react-quill";
import "./product.style.css";
import { MainContext } from "../../context/MainContext";

const ProductForm = () => {
  const { setLoader } = useContext(MainContext);
  const [data, setData] = useState({
    id: null,
    title: "",
    description: "",
    categoryId: null,
    gender:null
  });
  const [imageList, setImageList] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [category, setcategory] = useState([]);
  const [parentAttribute, setParentAttribute] = useState([]);
  const [parentAttributeEdit, setParentAttributeEdit] = useState([]);
  const [childAttribute, setChildAttribute] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([]);

  const [keyword, setKeyword] = useState("");
  // multiple att
  const [multipeView, setMultipeView] = useState(false);
  const [parentMultipleAttributeEdit, setParentMultipleAttributeEdit] =
    useState([]);
  const [childMultipleAttribute, setMultipleChildAttribute] = useState([]);
  const [attributeImage, setAttributeImage] = useState([]);
  const [selectedMultipleAttribute, setSelectedMultipleAttribute] = useState(
    []
  );
  const [attributeImageData, setAttributeImageData] = useState([]);
  const [bullet, setBullet] = useState([
    {
      point: "",
      productId: null,
    },
  ]);
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onClickImage = (file) => {
    setImageList(file);
  };

  const onAddKeyword = (item, itemList) => {
    if (itemList.join().length > 230) {
      return swal({
        title: "Keyword maximum length is 200 char",
        icon: "error",
        timer: 2500,
      });
    } else {
      setKeyword(itemList.join());
    }
  };

  const onSubmit = () => {
    setLoader(true);
    let finalAttribute = [];
    if (selectedAttribute.length && selectedMultipleAttribute.length) {
      let attributes = selectedAttribute;
      selectedMultipleAttribute.map((m) => attributes.push(m));
      finalAttribute = attributes;
    } else if (selectedAttribute.length && !selectedMultipleAttribute.length) {
      finalAttribute = selectedAttribute;
    } else {
      finalAttribute = selectedMultipleAttribute;
    }
    setSelectedAttribute(finalAttribute);

    if (!imageList.length) {
      setLoader(false);
      return swal({
        title: "Please select images!",
        timer: 2500,
        icon: "error",
      });
    }
    if (!finalAttribute.length) {
      setLoader(false);
      return swal({
        title: "Please select attributes!",
        timer: 2500,
        icon: "danger",
      });
    }

    let customData = {
      ...data,
      attributeList: finalAttribute,
      keywords: keyword,
    };
    var formData = new FormData();
    formData.append("productString", JSON.stringify(customData));
    imageList.map((m) => {
      formData.append("imageList", m);
    });
    addProduct(formData)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          let productId = res.data.data;

          try {
            attributeImageData.map((m) => {
              let form = new FormData();
              let attribute = {
                attributeId: m.attributeId,
                productId: productId,
              };
              form.append("attribute", JSON.stringify(attribute));
              m.imageList.map((n) => {
                form.append("imageList", n);
              });
              addAttributeImage(form).then((resp) => {
                console.log("attribute image add: ", resp);
              });
            });

            if (bullet.length) {
              let array = bullet.map((m) => {
                return {
                  ...m,
                  productId: productId,
                };
              });
              addPoint(array)
                .then((bul) => {
                  if (bul && bul.data.statusCode == 1) {
                    swal({
                      title: res.data.message,
                      icon: "success",
                      timer: 2500,
                    }).then((res) => window.location.reload());
                  } else {
                    swal({
                      title: bul.data.message,
                      icon: "error",
                      timer: 2500,
                    });
                  }
                  setLoader(false);
                })
                .catch((e) => setLoader(false));
            }
          } catch (error) {
            setLoader(false);
            console.log("something went wrong");
          }
        } else {
          setLoader(false);
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2500,
          });
        }
      })
      .catch((e) => setLoader(false));
  };
  const onChangeCategory = (e) => {
    setData({ ...data, categoryId: e.target.value });
  };
  const onChangeParentCategory = (e) => {
    let id = e.target.value;
    if (id != 0) {
      getChildCategoryListByParentId(id)
        .then((res) => {
          if (res.data.statusCode == 1) {
            let array = res.data.data.map((m) => {
              return {
                id: m.id,
                title: m.categoryName,
                active: m.active,
              };
            });
            setcategory(array);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  //  attribute...
  const onChangeAttribute = (selected) => {
    setParentAttributeEdit(selected);

    if (selected.length > 0) {
      let attribute = selected[selected.length - 1];

      getChildAttributeByParentId(attribute.value.id)
        .then((res) => {
          if (res.data && res.data.statusCode == 1) {
            let array = [];
            array = res.data.data.map((m) => {
              let val = { ...m, parentId: attribute.value.id };
              return {
                value: val,
                label: m.title,
              };
            });
            let temp = childAttribute;
            setChildAttribute([...temp, array]);
          }
        })
        .catch((e) => console.log(e));
    }
  };
  //  multi attribute...
  const onChangeMultiAttribute = (selected) => {
    setParentMultipleAttributeEdit(selected);
    if (selected.length > 0) {
      let attribute = selected[selected.length - 1];

      getChildAttributeByParentId(attribute.value.id)
        .then((res) => {
          if (res.data && res.data.statusCode == 1) {
            let array = res.data.data.map((m) => {
              let val = { ...m, parentId: attribute.value.id };
              return {
                value: val,
                label: m.title,
              };
            });
            setMultipleChildAttribute([...childMultipleAttribute, array]);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  // child attribute
  const onChangeChildAttribute = (select) => {
    let bigArray = selectedAttribute;
    if (select.length) {
      let lastChild = select[select.length - 1];
      let changeParent = parentAttributeEdit.filter(
        (f) => lastChild.value.parentId == f.value.id
      )[0];
      if (selectedAttribute.length == 0) {
        bigArray.push({
          parentAttributeId: changeParent.value.id,
          subAttributeList: [{ childAttributeId: lastChild.value.id }],
        });
      } else {
        selectedAttribute.map((m, i) => {
          if (m.parentAttributeId == lastChild.value.parentId) {
            bigArray[i].subAttributeList.push({
              childAttributeId: lastChild.value.id,
            });
          } else {
            if (selectedAttribute.length == 1) {
              bigArray.push({
                parentAttributeId: changeParent.value.id,
                subAttributeList: [{ childAttributeId: lastChild.value.id }],
              });
            }
          }
        });
      }
      setSelectedAttribute(bigArray);
    }
  };

  // multi child attribute
  const onChangeMultipleChildAttribute = (select) => {
    let lastChild = select[select.length - 1];
    let changeParent = parentMultipleAttributeEdit.filter(
      (f) => lastChild.value.parentId == f.value.id
    )[0];

    let ob = {
      attributeId: lastChild.value.id,
      attributeName: lastChild.label,
      imageList: [],
    };

    let array = [];
    attributeImage.map((m) => {
      array.push(m);
    });
    array.push(ob);
    setAttributeImage(array);

    let bigArray = [];
    bigArray = selectedMultipleAttribute;
    if (select.length) {
      if (selectedMultipleAttribute.length == 0) {
        bigArray.push({
          parentAttributeId: changeParent.value.id,
          multiImage: true,
          subAttributeList: [{ childAttributeId: lastChild.value.id }],
        });
      } else {
        selectedMultipleAttribute.map((m, i) => {
          if (m.parentAttributeId == lastChild.value.parentId) {
            bigArray[i].subAttributeList.push({
              childAttributeId: lastChild.value.id,
            });
          } else {
            if (selectedMultipleAttribute.length == 1) {
              bigArray.push({
                parentAttributeId: changeParent.value.id,
                multiImage: true,
                subAttributeList: [{ childAttributeId: lastChild.value.id }],
              });
            }
          }
        });
      }
    }

    console.log("finalArray multi: ", bigArray);
    setSelectedMultipleAttribute(bigArray);
  };

  const onClickMultiple = () => {
    setMultipeView(true);
  };
  const onChangeDesc = (value) => {
    setData({ ...data, description: value });
  };

  const onClickAttributeImage = (e, obj) => {
    if (e.length) {
      let data = attributeImageData;
      let object = {
        attributeId: obj.attributeId,
        imageList: e,
      };
      data.push(object);
      setAttributeImageData(data);
      console.log("on click image: ", object);
    }
  };
  const onIncreaseBullet = () => {
    setBullet([...bullet, { point: "", productId: null }]);
  };
  const onChangeGender = (e) => {
    setData({...data , gender : e.target.value})
  };
  const onChangeBullet = (value) => {
    if (value.length > 230) {
      return swal({
        title: "Bullet points maximum length is 230 char",
        icon: "error",
        timer: 2500,
      });
    } else {
      let body = {
        point: value,
        productId: null,
      };
      setBullet([body]);
    }
  };
  //  on load
  useEffect(() => {
    getParentCategory()
      .then((res) => {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m) => {
            return {
              id: m.id,
              title: m.categoryName,
              active: m.active,
            };
          });
          setParentCategory(array);
        }
      })
      .catch((e) => console.log(e));

    getParentAttribute()
      .then((res) => {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m) => {
            return {
              value: m,
              label: m.title,
            };
          });

          setParentAttribute(array);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="card p-3">
      <Row>
        <Col md={6} sm={12}>
          <label>Product title</label>
          <Input
            onChange={onChange}
            value={data.title}
            name="title"
            placeholder="Enter title"
          />
        </Col>
        <Col md={6} sm={12}>
          <label>
            Product description 
          </label>
          <ReactQuill value={data.description} onChange={onChangeDesc} />
        </Col>
        <Col md={6} sm={12}>
          <label>Select Gender</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={onChangeGender}
              value="Male"
            />
            <label class="form-check-label" for="flexRadioDefault1">
              Male
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              onChange={onChangeGender}
              value="Female"
            />
            <label class="form-check-label" for="flexRadioDefault2">
              Female
            </label>
          </div>
        </Col>
        <Col className="mt-4" lg={12} md={12} sm={12}>
          <MultipleValueTextInput
            onItemAdded={(item, allItems) => onAddKeyword(item, allItems)}
            onItemDeleted={(item, allItems) => console.log()}
            label="Enter keywords (Keyword maximum length is 230 char)"
            name="item-input"
            className="form-control"
            placeholder="Enter Product keywords"
            deleteButton={
              <span style={{ color: "red", paddingLeft: "7px" }}>x</span>
            }
          />
        </Col>
        <Col md={12} sm={12} className="my-3">
          <div>
            <label>
              Bullet Points (Bullet points maximum length is 230 char)
            </label>
            {/* <button
              className="btn btn-danger float-right my-1"
              onClick={onIncreaseBullet}
            >
              Add Row +
            </button> */}
          </div>
          <ReactQuill onChange={onChangeBullet} />
          {/* {bullet.length
            ? bullet.map((m, i) => (
                <Input
                  type="text"
                  onChange={(e) => onChangeBullet(e, i)}
                  // value={data.description}
                  className="my-1"
                  name="description"
                  multiple={true}
                  placeholder={`Enter bullet point ${i + 1}`}
                />
              ))
            : null} */}
        </Col>
        <Col md={6} sm={12}>
          <label>Select parent category</label>
          <Input type="select" onChange={onChangeParentCategory}>
            <option value={0}>Select</option>
            {parentCategory.length &&
              parentCategory.map((m, i) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
          </Input>
        </Col>
        <Col md={6} sm={12}>
          <label>Select sub category</label>
          <Input type="select" onChange={onChangeCategory}>
            <option>Select</option>
            {category.length &&
              category.map((m, i) => (
                <option key={i} value={m.id}>
                  {m.title}
                </option>
              ))}
          </Input>
        </Col>
        <Col className="mt-4" lg={6} md={6} sm={12}>
          <label>
            Select Attributes<sub>(maximum 4)</sub>
          </label>
          <Select
            options={parentAttribute}
            isMulti
            onChange={onChangeAttribute}
            closeMenuOnSelect={false}
            value={parentAttributeEdit}
          />
        </Col>
        <Col md={12} sm={12}>
          <Row>
            {parentAttributeEdit.length > 0 && childAttribute.length
              ? childAttribute.map((m, i) => (
                  <Col md={3} sm={6}>
                    <label>Select {m.title}</label>
                    <Select
                      options={m}
                      isMulti
                      onChange={onChangeChildAttribute}
                      closeMenuOnSelect={false}
                    />
                  </Col>
                ))
              : null}
          </Row>
        </Col>

        <Col className="mt-4 text-right" md={12} sm={12}>
          <Button color="secondary" onClick={onClickMultiple}>
            Show multiple view
          </Button>
        </Col>
        <Col md={12} sm={12} className={multipeView ? "visible" : "hidden"}>
          <Row>
            <Col md={6} sm={12}>
              <label>
                Select Multi images Attribute<sub>(maximum 4)</sub>
              </label>
              <Select
                options={parentAttribute}
                isMulti
                onChange={onChangeMultiAttribute}
                closeMenuOnSelect={false}
                // value={parentMultipleAttributeEdit}
              />
            </Col>
            <Col md={12} sm={12}>
              <Row>
                {parentMultipleAttributeEdit.length > 0 &&
                childMultipleAttribute.length
                  ? childMultipleAttribute.map((m, i) => (
                      <Col md={3} sm={6}>
                        <label>Select {m.title}</label>
                        <Select
                          options={m}
                          isMulti
                          onChange={onChangeMultipleChildAttribute}
                          closeMenuOnSelect={false}
                        />
                      </Col>
                    ))
                  : null}
              </Row>
            </Col>
            <Col md={12} sm={12}>
              <Row>
                {attributeImage.length > 0 && attributeImage.length
                  ? attributeImage.map((m, i) => (
                      <Col className="m-4" md={4} sm={4}>
                        <DropzoneArea
                          acceptedFiles={["image/*", "application/*"]}
                          onChange={(e) => onClickAttributeImage(e, m)}
                          dropzoneText={`Select ${m.attributeName}`}
                          showAlerts={false}
                          filesLimit={7}
                        />
                      </Col>
                    ))
                  : null}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col className="m-4" md={12} sm={12}>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickImage}
            dropzoneText="Drag images here."
            showAlerts={false}
            filesLimit={7}
          />
        </Col>
        <Col md={6} sm={12}>
          <Button color="primary" onClick={onSubmit}>
            ADD PRODUCT
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductForm;
