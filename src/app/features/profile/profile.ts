import { BaseModel } from "../../shared/models/base.model";
import { UserRole, VerificationStatus } from "../shared/enums/user.enums";

export interface Profile extends BaseModel {
    avatarUrl: string | null;
    currentLat: number | null;
    currentLon: number | null;
    email: string;
    fullName: string;
    isBlocked: boolean;
    isOnline: boolean;
    keycloakId: string;
    phone: string;
    role: UserRole;
    verificationStatus: VerificationStatus;
}
