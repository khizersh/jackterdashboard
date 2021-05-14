import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {  getProductFullDetailById } from "../../utility/httpService";
import ChildAttribute from "./ChildAttribute";
import ParentAttribute from "./ParentAttribute";

const EditProductAttribute = () => {
  const [key, setKey] = useState("home");
  const [attribute, setAttribute] = useState([]);
  const { id } = useParams();
  console.log("id: ", id);

  useEffect(() => {
    if (id) {
      getProductFullDetailById(id).then((res) => {
        if (res.data && res.data.statusCode == 1) {
        //   console.log(res.data.data);
          setAttribute(res.data.data.attributeList)
         
        }
      });
    }
  }, []);
  return (
    <div className="card card-body">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="home" title="Parent Attribute">
          <ParentAttribute data={attribute} pid={id}/>
          </Tab>
        <Tab eventKey="profile" title="Child Attribute">
         <ChildAttribute data={attribute} pid={id}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default EditProductAttribute;
