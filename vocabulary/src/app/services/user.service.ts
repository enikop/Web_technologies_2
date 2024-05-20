import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginDTO, AccessTokenDTO, UserDTO } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  getAuthenticated(){
    return this.http.post<any>('api/user/authenticated', {});
  }

  create(user: UserDTO) {
    return this.http.post<UserDTO>('api/user', user);
  }

  login(data: LoginDTO) {
    return this.http.post<AccessTokenDTO>('/api/user/login', data);
}
}
