import React, { useEffect, useState } from "react";
import { getCheckoutById, getOrderById } from "../../utility/httpService";
import { useParams } from "react-router-dom";
import swal from "sweetalert";

const OrderDetail = () => {
  const { id } = useParams();
  const [productList, setProductList] = useState([]);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getCheckoutById(id)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          setProductList(res.data.data.productList);
        } else {
          swal({
            title: res.data.message,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));

    getOrderById(id)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          setOrder(res.data.data);
        } else {
          swal({
            title: res.data.message,
            icon: "error",
          });
        }
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <div className="container">
      <div className="row">
        {productList.length
          ? productList.map((m, i) => (
              <div key={i} className="col-12 card my-2 shadow">
                <div className="row card-body">
                  <div className="col-6">
                    <h5>
                      Title:
                      <span>
                        <emp>{m.productTitle}</emp>
                      </span>
                    </h5>
                    <h6>
                      Price: <emp>{m.price}</emp>
                    </h6>
                    <h6>
                      Quanitity: <emp>{m.quantity}</emp>
                    </h6>
                    <div className="row">
                      <div className="col-12">
                        <h7>Product Detail</h7>
                        <ul>
                          {m.attributePrice.attribute_1 ? (
                            <li>{m.attributePrice.attribute_1}</li>
                          ) : null}
                          {m.attributePrice.attribute_2 ? (
                            <li>{m.attributePrice.attribute_2}</li>
                          ) : null}
                          {m.attributePrice.attribute_3 ? (
                            <li>{m.attributePrice.attribute_3}</li>
                          ) : null}
                          {m.attributePrice.attribute_4 ? (
                            <li>{m.attributePrice.attribute_4}</li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <img src={m.productImage} alt={"product"} width="170px" />
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      {order ? (
        <div className="row">
          <div className="col-12 card  shadow">
            <div className="row card-body">
              <div className="col-6">
                <h3>Order Infomation</h3>
                <h6>Order date: <span>{order.orderDate}</span></h6>
                <h6>Order status: <span>{order.orderStatus}</span></h6>
                <h6>Ship status: <span>{order.shipStatus}</span></h6>
                <h6>Coupon: <span>{order.couponAmount}</span></h6>
                <h6>Expidet shipping: <span>{order.expidetAmount || '--'}</span></h6>
                <h6>Total amount: <span>{order.totalAmount}</span></h6>
                <h6>Net amount: <span>{order.netAmount}</span></h6>
              </div>

              <div className="col-6">
                <h3>Customer Infomation</h3>
                <h6>Customer name: <span>{order.fullName}</span></h6>
                <h6>Email: <span>{order.email}</span></h6>
                <h6>Contact no: <span>{order.phoneNo}</span></h6>
                <h6>Country: <span>{order.country}</span></h6>
                <h6>State: <span>{order.state}</span></h6>
                <h6>City: <span>{order.city}</span></h6>
                <h6>Postal code: <span>{order.postalCode}</span></h6>
                <h6>Address line 1: <span>{order.addressLine1}</span></h6>
                <h6>Address line 2: <span>{order.addressLine2}</span></h6>
                <h6>Suggestion: <span>{order.suggestion}</span></h6>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OrderDetail;
