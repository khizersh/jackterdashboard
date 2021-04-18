import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { DropzoneArea } from "material-ui-dropzone";
import { editProductImage } from "../../utility/httpService";
import swal from "sweetalert";

const ImageEditModal = ({ toggle, modal, id }) => {
  const [image, setIamge] = useState(null);
  const [Id, setID] = useState(null);
  useEffect(() => {
    if (+id === +id) {
      setID(id);
    }
  }, [modal]);

  const onClickImage = (file) => {
    setIamge(file[0]);
  };
  const onClickEdit = () => {
    if (!image) {
      return swal({
        title: "Please select image!",
        timer: 2500,
        icon: "danger",
      });
    }
    var formData = new FormData();
    formData.append("imageFile", image);

    editProductImage(Id, formData)
      .then((res) => {
        if(res && res.data && res.data.statusCode == 1){
            return swal({
                title: "Image updated!",
                timer: 2500,
                icon: "success",
              });
        }
      })
      .catch((e) => console.log(e));
  };
  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Image</ModalHeader>
        <ModalBody>
          <DropzoneArea
            acceptedFiles={["image/*", "application/*"]}
            onChange={onClickImage}
            showFileNames
            dropzoneText="Drag images here."
            showAlerts={false}
            filesLimit={1}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onClickEdit}>
            UPDATE
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            CANCEL
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ImageEditModal;
