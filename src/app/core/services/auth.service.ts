import { Injectable } from '@angular/core';
import { api } from '../api/axios.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersUrl = '/users';

  async login(email: string, password: string) {
    const { data } = await api.get(this.usersUrl, {
      params: { email },
    });

    const user = data.find((u: any) => u.password === password);

    return user || null;
  }
}
