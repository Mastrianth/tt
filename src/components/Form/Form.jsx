import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./Form.scss";
import Button from "../Button/Button";
import ErrorText from "../FormComponent/ErrorText/ErrorText";
import Input from "../FormComponent/Input/Input";
import RadioButtons from "../FormComponent/RadoiButtons/RadioButtons";
import Modal from "../Modal/Modal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import getToken from "../../store/requestFunctions/getToken";
import getPositions from "../../store/requestFunctions/getPositions";
import postNewUser from "../../store/requestFunctions/postNewUser";
import {
  createSetIsSuccessModal,
  createShowModal,
  getFirstUsers,
} from "../../store/actionCreators";
import fieldProps from "./fieldProps";
import validationSchema from "./validationSchema";
import getUsers, { APIUrls } from "../../store/requestFunctions/getUsers";

const SignUpForm = () => {
  const { positions, token } = useSelector(
    (state) => state.registration,
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getToken());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPositions());
  }, [dispatch]);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    position: "",
    photo: "",
  };

  const url =
    window.innerWidth < 768
      ? APIUrls.getUsersMobileStartPage
      : APIUrls.getUsersTabletStartPage;

  const onSubmit = async (values, { resetForm }) => {
    const editedPhone = values.phone.split(" ").join("");
    const fileField = document.querySelector('input[type="file"]');

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", editedPhone);
    formData.append("position_id", values.position);
    formData.append("photo", fileField.files[0]);

    const config = { headers: { Token: `${token}` } };

    const success = await dispatch(postNewUser(config, formData));
    if (success) {
      resetForm({ values: "" });
      dispatch(createSetIsSuccessModal(success));
      dispatch(createShowModal());
      dispatch(getUsers());
      dispatch(getFirstUsers(url));
    } else {
      dispatch(createSetIsSuccessModal(success));
      dispatch(createShowModal());
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <label htmlFor="name">Name</label>
          <div className="field__control">
            <Field component={Input} {...fieldProps.name} />
            <ErrorMessage name={"name"} component={ErrorText} />
          </div>

          <label htmlFor="email">Email</label>
          <div className="field__control">
            <Field component={Input} {...fieldProps.email} />
            <ErrorMessage name={"email"} component={ErrorText} />
          </div>

          <label htmlFor="phone">Phone number</label>
          <div className="field__control">
            <Field component={Input} {...fieldProps.phone} maskedPhone={true} />
            <ErrorMessage name={"phone"} component={ErrorText} />
          </div>

          <RadioButtons {...fieldProps.positions} positions={positions} />

          <label htmlFor="photo" className="sign-up-form__label-photo">
            Photo
          </label>
          <div className="field__control field__control__file">
            <Field component={Input} {...fieldProps.photo} />
            <ErrorMessage name={"photo"} component={ErrorText} />
          </div>

          <div className="sign-up-form__btn-control">
            <Button text="Sign up now" submit={true} type="primary" />
          </div>
        </Form>
      </Formik>
      <Modal />
    </>
  );
};
export default SignUpForm;
