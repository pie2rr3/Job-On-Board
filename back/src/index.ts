import express, { Application } from "express";
import cors from "cors";
import UserController from "./UserController";
import AdminController from "./AdminController";
import AdsController from "./AdsController";
import AdsApplyController from "./AdsApplyController";
import CompanyController from "./CompanyController";

const app: Application = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(AdsController);
app.use(UserController);
app.use(AdminController);
app.use(CompanyController);
app.use(AdsApplyController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
