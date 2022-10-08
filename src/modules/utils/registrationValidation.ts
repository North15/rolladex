import * as Yup from "yup";

export const registerValidation = Yup.object({
    username: Yup.string()
        .required("Username is required")
        .min(6, "Username too short"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password too short"),
});
