import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Input, Button as ButtonR, Label, Table } from "reactstrap";
import swal from "sweetalert";
import Button from "@material-ui/core/Button";
import {
  getProductPriceListById,
  updateAttributePrice,
} from "../../utility/httpService";
import "./product.style.css";
import { reloadSetTime } from "../../utility/Service";

const SetPrice = () => {
  const { id } = useParams();
  const [priceList, setPriceList] = useState([]);
  const [edit, isEdit] = useState(false);
  const [editAll, setEditAll] = useState(false);
  const [data, setData] = useState({
    price: "",
    discountPrice: "",
    discount: false,
    index: null,
  });

  const onClickEdit = (obj, index) => {
    setEditAll(false);
    setData({
      ...data,
      price: obj.price ? obj.price : "",
      discountPrice: obj.discountPrice ? obj.discountPrice : "",
      discount: obj.discount ? obj.discount : false,
      index: index,
    });

    isEdit(true);
  };

  const onChange = (e) => {
    let amount = e.target.value;
    setData({ ...data, [e.target.name]: amount });

    if (data.index != null) {
      priceList[data.index][e.target.name] = amount;
    }
  };
  const onChangeAll = (e) => {
    let amount = e.target.value;
    setData({ ...data, [e.target.name]: amount });
    priceList.map((m) => {
      m[e.target.name] = amount;
    });
  };

  const onClickUpdate = () => {
    updateAttributePrice(priceList)
      .then((res) => {
        if (res && res.data && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
            timer: 2500,
            icon: "success",
          });
        } else {
          return swal({
            title: res.data.message,
            timer: 2500,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  };

  const onChangeDiscount = () => {
    setData({ ...data, discount: !data.discount });
    if (data.index != null) {
      priceList[data.index].discount = !data.discount;
      console.log(priceList[data.index].discount);
    }
  };
  const onChangeDiscountAll = () => {
    setData({ ...data, discount: !data.discount });

    priceList.map((m) => {
      m.discount = !data.discount;
    });
  };

  useEffect(() => {
    if (id) {
      getProductPriceListById(id)
        .then((res) => {
          if (res && res.data && res.data.statusCode == 1) {
            setPriceList(res.data.data);
          }
        })
        .catch((e) => console.log(e));
    }
  }, [id]);

  return (
    <div>
      <Row className="card p-4">
        {editAll && (
          <div>
            <Row className="p-4">
              <div className="w-100 text-center">
                <h2>Update all</h2>
              </div>
              <Col md={3} sm={12}>
                <Label>Enter Price</Label>
                <Input
                  type="number"
                  label="Enter Price"
                  onChange={onChangeAll}
                  value={data.price}
                  name="price"
                  placeholder="Enter Price"
                />
              </Col>
              <Col md={3} sm={12}>
                <Label>Enter Discount Price</Label>
                <Input
                  type="number"
                  label="Enter Discount Price"
                  onChange={onChangeAll}
                  value={data.discountPrice}
                  name="discountPrice"
                  placeholder="Enter Discount Price"
                />
              </Col>
              <Col md={2} sm={12} className="m-auto pt-3">
                <Label check>
                  <Input
                    type="checkbox"
                    onChange={onChangeDiscountAll}
                    checked={data.discount ? data.discount : false}
                  />
                  On Discount{" "}
                </Label>
              </Col>
              <Col md={2} sm={12} className="m-auto pt-3">
                <ButtonR color="primary" onClick={onClickUpdate}>
                  UPDATE ALL
                </ButtonR>
              </Col>
            </Row>
            <hr />
          </div>
        )}

        {edit && (
          <div>
            <Row className="p-4">
              <div className="w-100 text-center">
                <h2>Update specific</h2>
              </div>
              <Col md={3} sm={12}>
                <Label>Enter Price</Label>
                <Input
                  type="number"
                  label="Enter Price"
                  onChange={onChange}
                  value={data.price}
                  name="price"
                  placeholder="Enter Price"
                />
              </Col>
              <Col md={3} sm={12}>
                <Label>Enter Discount Price</Label>
                <Input
                  type="number"
                  label="Enter Discount Price"
                  onChange={onChange}
                  value={data.discountPrice}
                  name="discountPrice"
                  placeholder="Enter Discount Price"
                />
              </Col>
              <Col md={2} sm={12} className="m-auto pt-3">
                <Label check>
                  <Input
                    type="checkbox"
                    onChange={onChangeDiscount}
                    checked={data.discount ? data.discount : false}
                  />
                  On Discount{" "}
                </Label>
              </Col>
              <Col md={2} sm={12} className="m-auto pt-3">
                <ButtonR color="primary" onClick={onClickUpdate}>
                  UPDATE
                </ButtonR>
              </Col>
            </Row>
            <hr />
          </div>
        )}
        <Col md={12} sm={12}>
          <div>
            <h3>{priceList && priceList.length && priceList[0].productName}</h3>
          </div>
          <div className="w-100 text-right">
            <Button
              color="danger"
              className
              variant="contained"
              size="sm"
              onClick={() => {
                isEdit(false);
                setEditAll(true);
              }}
            >
              UPDATE ALL
            </Button>
          </div>
          <Table bordered>
            <thead>
              <tr>
                <th>S#</th>
                <th>Attribute 1</th>
                <th>Attribute 2</th>
                <th>Attribute 3</th>
                <th>Attribute 4</th>
                <th>Price</th>
                <th>Discount Price</th>
                <th>On Discount?</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {priceList.length
                ? priceList.map((m, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{m.attribute_1 ? m.attribute_1 : "-"}</td>
                      <td>{m.attribute_2 ? m.attribute_2 : "-"}</td>
                      <td>{m.attribute_3 ? m.attribute_3 : "-"}</td>
                      <td>{m.attribute_4 ? m.attribute_4 : "-"}</td>
                      <td>{m.price}</td>
                      <td>{m.discountPrice}</td>
                      <td>{m.discount ? "Yes" : "No"}</td>
                      <td>
                        {" "}
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => onClickEdit(m, i)}
                        >
                          UPDATE
                        </Button>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default SetPrice;
