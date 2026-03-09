export interface UpdateProfileRequestDTO {
  fullName?: string;
  phone?: string;
  avatar?: File | null;
  currentLat?: number;
  currentLon?: number;
}
