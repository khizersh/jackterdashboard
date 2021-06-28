import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form } from "react-bootstrap";
import {
  getCouponByUser,
  getCoupons,
  assignCouponToUser,
  deleteAssignCoupon,
} from "../../utility/httpService";
import swal from "sweetalert";

const UserCoupons = () => {
  const { id } = useParams();

  const [coupons, setCoupon] = useState([]);
  const [data, setData] = useState({
    userId: "",
    couponId: "",
  });
  const [assignCoupon, setAssignCoupon] = useState([]);

  const onAssign = (e) => {
    if (!data.userId || !data.couponId) {
      return swal({
        title: "Enter all fields",
        timer: 2500,
        icon: "error",
      });
    }

    assignCouponToUser(data)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
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
  const onRemove = (e) => {
    if (!e.id) {
      return swal({
        title: "Enter all fields",
        timer: 2500,
        icon: "error",
      });
    }

    deleteAssignCoupon(e.id)
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          swal({
            title: res.data.message,
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

  const handleChangeSelect = (e) => {
    console.log(e.target.value);
    setData({ ...data, couponId: e.target.value });
  };

  useEffect(() => {
    if (id) {
      setData({ ...data, userId: id });

      getCouponByUser(id)
        .then((res) => {
          if (res && res.data.statusCode == 1) {
            setAssignCoupon(res.data.data);
          }
        })
        .catch((e) => console.log(e));
    }

    getCoupons()
      .then((res) => {
        if (res && res.data.statusCode == 1) {
          setCoupon(res.data.data);
        }
      })
      .catch((e) => console.log(e));
  }, [id]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-8">
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select parent attribute</Form.Label>
                <Form.Control as="select" onChange={handleChangeSelect}>
                  <option value="">Select</option>
                  {coupons.length
                    ? coupons.map((m, i) => (
                        <option key={i} value={m.id}>
                          {m.title}
                        </option>
                      ))
                    : ""}
                </Form.Control>
              </Form.Group>
            </div>
            <div className="col-4 mt-4">
              <button className="btn btn-danger" onClick={onAssign}>
                Assign Coupon
              </button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">User name</th>
                <th scope="col">Coupon title</th>
                <th scope="col">Percentage off</th>
                <th scope="col">Used</th>
              </tr>
            </thead>
            <tbody>
              {assignCoupon.length
                ? assignCoupon.map((m, i) => (
                    <tr key={i} >
                      <th scope="row">1</th>
                      <td>{m.userName}</td>
                      <td>{m.couponTitle}</td>
                      <td>{m.percentageOff}</td>
                      <td>
                        <span
                          className={`px-2 badge badge-${
                            m.used ? "danger" : "success"
                          }`}
                        >
                          {m.used ? "Yes" : "No"}
                        </span>{" "}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => onRemove(m)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                : <td colSpan="3">No record Found</td>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserCoupons;
