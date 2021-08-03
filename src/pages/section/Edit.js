import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  addSectionItemWithList,
  getItemsBySectionId,
  getProducts,
  changeItemPosition,
  removeSectionItem,
} from "../../utility/httpService";
import { Container, Row, Col, Card, CardBody, Input } from "reactstrap";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import swal from "sweetalert";
import { reloadSetTime } from "../../utility/Service";
import { MainContext } from "../../context/MainContext";

const Edit = () => {
  const { setLoader } = useContext(MainContext);
  const history = useHistory();
  const { id } = useParams();
  const [data, setData] = useState({ id: null, title: "" });
  const [productList, setproductList] = useState([]);
  const [allProductList, setaAllProductList] = useState([]);
  const [selectedProduct, setselectedProduct] = useState([]);
  const [edit, setEdit] = useState(false);
  const [position, setPosition] = useState({
    id: null,
    from: null,
    to: null,
  });
  const [isPos, setIsPos] = useState(false);
  console.log(productList);
  const addProduct = () => {
    getProducts()
      .then((res) => {
        if (res.data.statusCode == 1) {
          let array = res.data.data.map((m) => {
            return {
              value: m.id,
              label: m.title,
            };
          });
          setaAllProductList(array);
        }
      })
      .catch((e) => console.log());
    setEdit(true);
  };

  const onSelect = (e) => {
    setselectedProduct(e);
  };
  const onClickRemove = (data) => {
    setLoader(true);

    removeSectionItem({ sectionId: id, sequence: data.sequence })
      .then((res) => {
        setLoader(false);
        if (res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2000,
            icon: "success",
          });
        }else{
          swal({
            title: res.data.message,
            icon: "error",
            timer: 2000,
          });
        }
      })
      .catch((e) => {
        setLoader(false);
      });
  };

  const onClick = () => {
    if (!selectedProduct.length) {
      return swal({ title: "No product found!", timer: 2500, icon: "error" });
    }
    let body = selectedProduct.map((m) => {
      return {
        sectionId: id,
        productId: m.value,
      };
    });
    addSectionItemWithList(body)
      .then((res) => {
        if (res.data.statusCode == 1) {
          swal({ title: res.data.data, timer: 2500, icon: "success" }).then(
            (resu) => {
              reloadSetTime(2.5);
            }
          );
        }
      })
      .catch((e) => console.log(e));
  };

  const changePosiotion = (seq) => {
    setIsPos(true);
    setPosition({ id: seq.id, from: seq.sequence });
  };

  const onChangePos = (e) => {
    setPosition({ ...position, [e.target.name]: e.target.value });
  };

  const onClickChangePosition = () => {
    if (!position.to || !position.from || !position.id) {
      return swal({
        title: "Enter all field!",
        timer: 2500,
        icon: "error",
      });
    }

    changeItemPosition(position)
      .then((res) => {
        if (res.data.statusCode == 1) {
          swal({
            title: res.data.data,
            timer: 2500,
            icon: "success",
          });
        } else {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getItemsBySectionId(id)
      .then((res) => {
        if (res.data.statusCode == 1) {
          setData({ id: id, title: res.data.data.title });
          setproductList(res.data.data.productList);
        }
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <div>
      {isPos && (
        <Container>
          <Card>
            <CardBody>
              <Row>
                <Col md={4} sm={6}>
                  <label>Selected Position</label>
                  <Input
                    type="number"
                    name="from"
                    disabled
                    value={position.from}
                    onChange={onChangePos}
                  />
                </Col>
                <Col md={4} sm={6}>
                  <label>Change Position</label>
                  <Input
                    type="number"
                    name="to"
                    value={position.to}
                    onChange={onChangePos}
                  />
                </Col>
                <Col md={4} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-4"
                    onClick={onClickChangePosition}
                  >
                    ADD PRODUCT
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      )}

      {edit && (
        <Container>
          <Card>
            <CardBody>
              <Row>
                <Col md={6} sm={12}>
                  <label>Select product</label>
                  <Select
                    options={allProductList}
                    isMulti
                    onChange={onSelect}
                    closeMenuOnSelect={false}
                  />
                </Col>
                <Col md={6} sm={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-4"
                    onClick={onClick}
                  >
                    ADD PRODUCT
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      )}
      <Container>
        <Card>
          <CardBody>
            <Row>
              <Col md={6} sm={12}>
                <Button
                  variant="text"
                  color="dprimary"
                  className="mt-4"
                  onClick={() => history.goBack()}
                >
                  Go Back
                </Button>
              </Col>
              <Col md={6} sm={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  className="mt-4 float-right"
                  onClick={addProduct}
                >
                  ADD PRODUCT
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={12} sm={12}>
                <table width="100%" border="1">
                  <thead>
                    <tr>
                      <th>Serial#</th>
                      <th>Product title</th>
                      <th>Product Image</th>
                      <th>Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList && productList.length
                      ? productList.map((m, i) => (
                          <tr key={i}>
                            <td>{m.sequence}</td>
                            <td>{m.title}</td>
                            <td>
                              {" "}
                              <img src={m.imageList[0].image} width="60" />{" "}
                            </td>
                            <td>{m.categoryName}</td>
                            <td>
                              <Button
                                variant="text"
                                color="primary"
                                onClick={() => changePosiotion(m)}
                              >
                                Change Positon
                              </Button>
                              <Button
                                variant="text"
                                color="secondary"
                                onClick={() => onClickRemove(m)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Edit;
