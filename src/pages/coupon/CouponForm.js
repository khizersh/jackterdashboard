import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { addCoupon, getCouponById , editCoupon} from "../../utility/httpService";

const CouponForm = () => {
  const param = useParams();
  const router = useHistory();

  const [data, setData] = useState({
    id: "",
    title: "",
    code: "",
    startingDate: "",
    percentageOff: 0,
    expiryDate: "",
    expired: false,
  });
  const [edit, setEdit] = useState(false);

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onChangeDate = (e) => {
    console.log(e.target.value);
  };

  const onClick = () => {
    if (!data.expiryDate || !data.percentageOff || !data.title) {
      return swal({ title: "Enter all fields!", timer: 2500, icon: "error" });
    }
    if (edit) {
        delete data.hibernateLazyInitializer
        editCoupon(data)
        .then((res) => {
          if (res && res.data.statusCode == 1) {
            swal({ title: res.data.message, timer: 2500, icon: "success" });
          } else {
            swal({ title: res.data.message, timer: 2500, icon: "error" });
          }
        })
        .catch((e) => console.log(e));
    } else {
      addCoupon(data)
        .then((res) => {
          if (res && res.data.statusCode == 1) {
            swal({ title: res.data.message, timer: 2500, icon: "success" });
          } else {
            swal({ title: res.data.message, timer: 2500, icon: "error" });
          }
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    console.log("router: ", router.location.search);
    let query = router.location.search;
    if (query) {
      let id = query.split("=")[1];
      if (id) {
        getCouponById(id)
          .then((res) => {
            if (res && res.data.statusCode == 1) {
              setData(res.data.data);
            } else {
            }
          })
          .catch((e) => console.log(e));
        setEdit(true);
      }
    }
  }, [param]);

  return (
    <div className="container card shadow">
      <div className="row card-body">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter title"
              name="title"
              value={data.title}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label>Discount %</label>
            <input
              type="number"
              className="form-control"
              name="percentageOff"
              value={data.percentageOff}
              onChange={onChange}
              placeholder="Enter discount"
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label>Expiry date</label>
            <input
              type="date"
              className="form-control"
              placeholder="dd-mm-yyyy"
              name="expiryDate"
              value={data.expiryDate}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-12 text-center mt-2">
          <button className="btn btn-primary" onClick={onClick}>
            {edit ? "EDIT COUPON" : "ADD COUPON"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponForm;
