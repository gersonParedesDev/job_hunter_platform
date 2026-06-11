import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Profile {
  id: string;
  userId: string;
  profession: string;
  skills: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  createUser(user: { name: string; email: string; phone: string }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/users`, user);
  }

  createProfile(profile: { userId: string; profession: string; skills: string[] }): Observable<ApiResponse<Profile>> {
    return this.http.post<ApiResponse<Profile>>(`${this.baseUrl}/profiles`, profile);
  }

  getUserProfiles(userId: string): Observable<ApiResponse<Profile[]>> {
    return this.http.get<ApiResponse<Profile[]>>(`${this.baseUrl}/profiles/user/${userId}`);
  }
}
