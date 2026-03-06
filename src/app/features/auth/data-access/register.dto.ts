import { UserRole } from "../../shared/enums/user.enums";

export interface RegisterDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}
