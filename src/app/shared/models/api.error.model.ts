import { HttpStatusCode } from "@angular/common/http";

export interface ApiError {
    message: string;
    errorCode: string;
    status: HttpStatusCode;
    timestamp: Date;
    details: string[];
}