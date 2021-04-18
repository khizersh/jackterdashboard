import React, { useState, useEffect } from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";
import {
  addProduct,
  getParentAttribute,
  getParentCategory,
  getChildCategoryListByParentId,
  getChildAttributeByParentId,
  addAttributeImage,
} from "../../utility/httpService";
import swal from "sweetalert";
import Select from "react-select";
import { Childattribute } from "../../utility/apiLinks";
import "./product.style.css";
import { TrendingUp } from "@material-ui/icons";

const ProductForm = () => {
  const [data, setData] = useState({
    id: null,
    title: "",
    description: "",
    categoryId: null,
  });
  const [imageList, setImageList] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [category, setcategory] = useState([]);
  const [parentAttribute, setParentAttribute] = useState([]);
  const [parentAttributeEdit, setParentAttributeEdit] = useState([]);
  const [childAttribute, setChildAttribute] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([]);

  // multiple att
  const [multipeView, setMultipeView] = useState(false);
  const [
    parentMultipleAttributeEdit,
    setParentMultipleAttributeEdit,
  ] = useState([]);
  const [childMultipleAttribute, setMultipleChildAttribute] = useState([]);
  const [attributeImage, setAttributeImage] = useState([]);
  const [selectedMultipleAttribute, setSelectedMultipleAttribute] = useState(
    []
  );
  const [attributeImageData, setAttributeImageData] = useState([]);
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onClickImage = (file) => {
    setImageList(file);
  };

  const onSubmit = () => {
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
      return swal({
        title: "Please select images!",
        timer: 2500,
        icon: "danger",
      });
    }
    if (!finalAttribute.length) {
      return swal({
        title: "Please select attributes!",
        timer: 2500,
        icon: "danger",
      });
    }

    let customData = { ...data, attributeList: selectedAttribute };
    console.log("customData: ", customData);
    var formData = new FormData();
    formData.append("productString", JSON.stringify(customData));
    imageList.map((m) => {
      formData.append("imageList", m);
    });
    addProduct(formData).then((res) => {
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
        } catch (error) {
          console.log("something went wrong");
        }

        swal({
          title: res.data.message,
          icon: "success",
          timer: 2500,
        });
      } else {
        swal({
          title: "Something went wrong!",
          icon: "success",
          timer: 2500,
        });
      }
    });
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
          console.log("res: ",res);
          if (res.data && res.data.statusCode == 1) {
            let array = res.data.data.map((m) => {

              let val  = {...m , parentId : attribute.value.id}
              return {
                value: val,
                label: m.title,
              };
            });
            let temp = childAttribute;
            console.log("temp: ",temp);
            setChildAttribute([...temp, array]);
          }
        })
        .catch((e) => console.log(e));
    }
  };
  //  multi attribute...
  const onChangeMultiAttribute = (selected) => {
    setParentMultipleAttributeEdit(selected);
    console.log("selected: ", selected);
    if (selected.length > 0) {
      let attribute = selected[selected.length - 1];

      getChildAttributeByParentId(attribute.value.id)
        .then((res) => {
          if (res.data && res.data.statusCode == 1) {
            let array = res.data.data.map((m) => {
              let val  = {...m , parentId : attribute.value.id}
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
  const onChangeChildAttribute = (e) => {
    let finalArray = [];
    if (e.length) {
      console.log("e: ",e);
      console.log("parentAttributeEdit: ", parentAttributeEdit);
      parentAttributeEdit.map((m) => {
        let obj = {};
        let array = e.filter((f) => m.value.id == f.value.parentId);
  
        let customArray = array.map((n) => {
          return {
            childAttributeId: n.value.id,
          };
        });
        obj = {
          parentAttributeId: m.value.id,
          subAttributeList: customArray,
        };
        finalArray.push(obj);
      });
    }
    console.log("finalArray single: ", finalArray);
    setSelectedAttribute(finalArray);
  };

  // multi child attribute
  const onChangeMultipleChildAttribute = (e) => {
    let att = e[e.length - 1];
    let ob = {
      attributeId: att.value.id,
      attributeName: att.label,
      imageList: [],
    };

    let array = attributeImage;
    array.push(ob);
    setAttributeImage(array);

    let finalArray = [];
    if (e.length) {
      parentMultipleAttributeEdit.map((m) => {
        let obj = {};
        let array = e.filter((f) => m.value.id == f.value.parentId);
        let customArray = array.map((n) => {
          return {
            childAttributeId: n.value.id,
          };
        });
        obj = {
          parentAttributeId: m.value.id,
          multiImage: true,
          subAttributeList: customArray,
        };
        finalArray.push(obj);
      });
    }

    console.log("finalArray multi: ", finalArray);
    setSelectedMultipleAttribute(finalArray);
    // let array1 = selectedAttribute;
    //  finalArray.map(m => array1.push(m))
    // setSelectedAttribute(array1);
  };

  const onClickMultiple = () => {
    setMultipeView(true);
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
          <label>Product description</label>
          <Input
            type="textarea"
            onChange={onChange}
            value={data.description}
            name="description"
            multiple={true}
            placeholder="Enter description"
          />
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
                      onChange={() => onChangeChildAttribute(m)}
                      closeMenuOnSelect={false}
                    />
                  </Col>
                ))
              : null}
          </Row>
        </Col>

        <Col className="mt-4 text-right" md={12} sm={12}>
          <Button color="danger" onClick={onClickMultiple}>
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
                value={parentMultipleAttributeEdit}
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
                          showFileNames
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
            showFileNames
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
