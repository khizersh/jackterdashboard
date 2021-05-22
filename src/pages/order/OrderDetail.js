import React, { useEffect, useState } from "react";
import { getCheckoutById } from "../../utility/httpService";
import { useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";

const OrderDetail = () => {
  const { id } = useParams();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    getCheckoutById(id)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          console.log("res: ", res.data);
          setProductList(res.data.data.productList);
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
                        <h7>Attribute Detail</h7>
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
                  <div className="col-6">
                    <img src={m.productImage} alt={"product"} />
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default OrderDetail;
