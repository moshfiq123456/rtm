import bcrypt from "bcrypt";
import app from './app';
import  User  from "./model/user.model";


const PORT = process.env.PORT || 3000;

(async () => {
  try {;
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash("Admin@12345", salt);

    async function createDefaultSuperAdmin() {
      const superAdmin = await User.findOne({ roles: "super_admin" });
      if (!superAdmin) {
        await User.create({
          userName: "admin",
          email: "admin@gmail.com",
          password: hashPassword,
          roles: "super_admin",
        });
      }
    }

    await createDefaultSuperAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit the process with a non-zero exit code
  }
})();
